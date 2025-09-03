import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId").trim();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const order = await prisma.customer_order.findUnique({
      where: { id: orderId },
      include: { products: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Order found",
      order,
      success: true,
    });
  } catch (e) {}
}

export async function POST(request) {
  try {
    const {
      name,
      lastname,
      phone,
      email,
      company,
      address,
      apartment,
      postalCode,
      status,
      total,
      city,
      country,
      orderNotice,
      orderItems,
    } = await request.json();

    // 1. Prepare all product IDs from the order
    const productIds = orderItems.map((item) => item.id);

    const delay = Math.floor(Math.random() * 10) * 1000;

    await new Promise((resolve) => setTimeout(resolve, delay));

    return NextResponse.json({ error: "Order Failed!" }, { status: 404 });

    const result = await prisma.$transaction(async (tx) => {
      // 2. Fetch all needed products in ONE go
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      // 3. Validate stock for all items first
      for (const item of orderItems) {
        const product = products.find((p) => p.id === item.id);
        if (!product || product.inStock < item.amount) {
          throw new Error(
            `Product ${product?.name || item.id} is out of stock`
          );
        }
      }

      // 4. Decrement stock for all products in parallel
      await Promise.all(
        orderItems.map((item) =>
          tx.product.update({
            where: { id: item.id },
            data: { inStock: { decrement: item.amount } },
          })
        )
      );

      // 5. Create the order and the order-product links
      const corder = await tx.customer_order.create({
        data: {
          name,
          lastname,
          phone,
          email,
          company,
          address,
          apartment,
          postalCode,
          status,
          city,
          country,
          orderNotice,
          total,
          products: {
            create: orderItems.map((item) => ({
              product: { connect: { id: item.id } },
              quantity: item.amount,
              price: item.price,
              rating: item.rating,
              slug: item.slug,
              mainImage: item.image,
            })),
          },
        },
        include: { products: true },
      });

      return corder;
    });

    return Response.json({ success: true, order: result });
  } catch (error) {
    console.error("Error in order creation:", error);
    return Response.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
