import Container from "@/components/modules/custom/Container";
import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    // TODO:Custom not found page
    <section>
      <Container>
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
          <h1 className="text-8xl font-extrabold text-blue-600">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-500 mt-2 text-center max-w-md">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
          <img
            src="/assets//images/404.jpg"
            alt="Page Not Found"
            className="w-80 h-44 mt-6"
          />
          <Link
            href="/"
            className="mt-6 px-6 py-3 bg-blue-600 text-white bg-primary-600 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Go Back Home
          </Link>
        </div>{" "}
      </Container>
      ;
    </section>
  );
}

// import Link from "next/link";

// export default function NotFoundPage() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
//       <h1 className="text-8xl font-extrabold text-blue-600">404</h1>
//       <h2 className="text-2xl font-semibold text-gray-800 mt-4">
//         Oops! Page Not Found
//       </h2>
//       <p className="text-gray-500 mt-2 text-center max-w-md">
//         The page you are looking for might have been removed, had its name
//         changed, or is temporarily unavailable.
//       </p>
//       <img
//         src="/assets/404.svg"
//         alt="Page Not Found"
//         className="w-80 h-auto mt-6"
//       />
//       <Link
//         href="/"
//         className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
//       >
//         Go Back Home
//       </Link>
//     </div>
//   );
// }
