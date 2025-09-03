import { getServerSession } from "next-auth";
import { authOptions } from "@/scripts/authOptions"; // update if your path differs
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET: fetch full cart for current user
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });
  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: true },
      },
    },
  });
  return Response.json(cart || { items: [] });
}

// POST: add/update quantity of a cart item
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });
  const { productId, quantity } = await req.json();
  if (!productId || typeof quantity !== "number" || quantity < 1)
    return new Response("Invalid", { status: 400 });

  let cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
  });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId: session.user.id } });
  }
  await prisma.cartItem.upsert({
    where: {
      cartId_productId: { cartId: cart.id, productId },
    },
    update: { quantity },
    create: { cartId: cart.id, productId, quantity },
  });
  return Response.json({
    message: "Item added of cart is successful",
    success: true,
  });
}

// DELETE: remove a product from cart
export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });
  const { productId } = await req.json();
  if (!productId) return new Response("Invalid", { status: 400 });

  let cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
  });
  if (!cart) return new Response("Cart not found", { status: 404 });

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id, productId },
  });
  return Response.json({
    message: "Item deleted of cart is successful",
    success: true,
  });
}
