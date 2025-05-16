import React from "react";

import { IoArrowRedo, IoArrowUndoSharp } from "react-icons/io5";

const PaginationComponent = ({ currentPage, totalDataCount, dataPerPage, paginate }) => {
  const totalPages = Math.ceil(totalDataCount / dataPerPage);

  return (
    <div className="w-[calc(100%-20px)] absolute bottom-0 flex items-center justify-center">
      <div className="mb-5 flex list-none justify-center items-center gap-2.5 bg-white px-3 py-2 rounded-full shadow-lg shadow-gray-600">
        <div>
          <button
            title="View Previous Page"
            className={`bg-pink-600 text-white h-[30px] w-[30px] rounded-md grid place-content-center border-none outline-none ${
              currentPage === 1 ? "opacity-40 cursor-not-allowed" : "hover:opacity-90"
            }`}
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <IoArrowUndoSharp />
          </button>
        </div>
        <div>{`Page ${currentPage} of ${totalPages}`}</div>
        <div>
          <button
            title="View Next Page"
            className={`bg-pink-600 text-white h-[30px] w-[30px] rounded-md grid place-content-center border-none outline-none ${
              currentPage === totalPages ? "opacity-40 cursor-not-allowed" : "hover:opacity-90"
            }`}
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <IoArrowRedo />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginationComponent;
