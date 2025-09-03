import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request, { params }) {
  params = await params;
  const { id } = params;
  const images = await prisma.productImage.findMany({
    where: { productId: id },
  });
  return Response.json(images);
}
