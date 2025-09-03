import { FaCircleQuestion } from "react-icons/fa6";
import Link from "next/link";

const OrderSummary = ({ total, products, mode, makePurchase }) => {
  return (
    <section
      aria-labelledby="summary-heading"
      className="mt-16 lg:mt-0 lg:col-span-5"
    >
      <div className="sticky top-24 min-h-[380px] rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-6" id="summary-heading">
            Order summary
          </h2>

          <dl className="space-y-4">
            <div className="flex justify-between">
              <dt className="text-sm">Subtotal</dt>
              <dd className="text-sm font-semibold">${total.toFixed(2)}</dd>
            </div>

            <div className="flex justify-between border-t border-gray-200 pt-4">
              <dt className="flex items-center text-sm">
                Shipping estimate
                <FaCircleQuestion className="ml-2 h-4 w-4 text-gray-400" />
              </dt>
              <dd className="text-sm font-semibold">$5.00</dd>
            </div>

            <div className="flex justify-between border-t border-gray-200 pt-4">
              <dt className="flex items-center text-sm">
                Tax estimate
                <FaCircleQuestion className="ml-2 h-4 w-4 text-gray-400" />
              </dt>
              <dd className="text-sm font-semibold">
                ${(total / 5).toFixed(2)}
              </dd>
            </div>

            <div className="flex justify-between border-t border-gray-200 pt-4">
              <dt className="text-base font-bold">Order total</dt>
              <dd className="text-base font-bold">
                $
                {total === 0 ? 0 : Math.round(total + total / 5 + 5).toFixed(2)}
              </dd>
            </div>
          </dl>
        </div>

        {products.length > 0 && (
          <div className="mt-6">
            {mode === "checkout" ? (
              <button
                type="button"
                onClick={makePurchase}
                className="w-full rounded-md border border-transparent bg-[color:var(--color-bg)] px-6 py-3 text-lg font-medium text-white hover:opacity-90"
              >
                Pay Now
              </button>
            ) : (
              <Link
                href="/checkout"
                className="block w-full text-center border border-[#35530e] text-[#35530e] font-semibold py-3 rounded-md hover:bg-[#35530e] hover:text-white transition"
              >
                CHECKOUT
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default OrderSummary;
