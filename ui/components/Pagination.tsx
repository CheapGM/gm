"use client";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        
        if (totalPages <= 7) {
            // Show all pages if 7 or less
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);
            
            if (currentPage > 3) {
                pages.push(2);
                pages.push("...");
            } else {
                pages.push(2);
                pages.push(3);
            }
            
            // Show current page and neighbors
            if (currentPage > 3 && currentPage < totalPages - 2) {
                pages.push(currentPage);
            }
            
            // Show last pages
            if (currentPage < totalPages - 2) {
                pages.push("...");
                pages.push(totalPages - 1);
            } else {
                pages.push(totalPages - 2);
                pages.push(totalPages - 1);
            }
            
            pages.push(totalPages);
        }
        
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <>
            {/* Desktop Pagination */}
            <div className="tablet:hidden flex items-center justify-center w-full py-6">
                <div className="flex items-center rounded-xl overflow-hidden border border-[rgba(230,230,230,0.8)]">
                    {/* Previous Button */}
                    <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className="flex items-center justify-center gap-2 px-4 py-[10px] bg-white border-r border-[rgba(230,230,230,0.8)] hover:bg-[rgba(241,241,241,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12.5 15L7.5 10L12.5 5"
                                stroke="#030303"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="text-sm font-medium text-[#030303] font-poppins">
                            Previous
                        </span>
                    </button>

                    {/* Page Numbers */}
                    {pageNumbers.map((page, index) => (
                        <div key={index} className="flex items-center">
                            {index > 0 && (
                                <div className="w-[1px] h-10 bg-[rgba(230,230,230,0.8)]" />
                            )}
                            {typeof page === "number" ? (
                                <button
                                    onClick={() => onPageChange(page)}
                                    className={`flex flex-col items-center justify-center w-10 bg-white hover:bg-[rgba(241,241,241,0.3)] transition-colors ${
                                        currentPage === page
                                            ? "border-t-2 border-t-[#0177E7]"
                                            : "border-t border-t-[rgba(230,230,230,0.8)]"
                                    }`}
                                >
                                    <div className="flex items-center justify-center py-[9px] px-2">
                                        <span
                                            className={`text-sm font-medium font-poppins ${
                                                currentPage === page
                                                    ? "text-[#0177E7]"
                                                    : "text-[rgba(3,3,3,0.6)]"
                                            }`}
                                        >
                                            {page}
                                        </span>
                                    </div>
                                    <div
                                        className={`w-full h-[1px] ${
                                            currentPage === page
                                                ? "bg-transparent"
                                                : "bg-[rgba(230,230,230,0.8)]"
                                        }`}
                                    />
                                </button>
                            ) : (
                                <div className="flex flex-col items-center justify-center w-10 bg-white border-t border-t-[rgba(230,230,230,0.8)]">
                                    <div className="flex items-center justify-center py-[9px] px-2">
                                        <span className="text-sm font-medium text-[rgba(3,3,3,0.6)] font-poppins">
                                            {page}
                                        </span>
                                    </div>
                                    <div className="w-full h-[1px] bg-[rgba(230,230,230,0.8)]" />
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Next Button */}
                    <div className="w-[1px] h-10 bg-[rgba(230,230,230,0.8)]" />
                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className="flex items-center justify-center gap-2 px-4 py-[10px] bg-white hover:bg-[rgba(241,241,241,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <span className="text-sm font-medium text-[#030303] font-poppins">
                            Next
                        </span>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M7.5 15L12.5 10L7.5 5"
                                stroke="#030303"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Pagination */}
            <div className="hidden tablet:flex items-center justify-center w-full py-4">
                <div className="flex items-center w-full rounded-xl overflow-hidden border border-[rgba(230,230,230,0.8)]">
                    {/* Previous Button */}
                    <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className="flex items-center justify-center gap-2 px-4 py-[10px] bg-white border-r border-[rgba(230,230,230,0.8)] hover:bg-[rgba(241,241,241,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12.5 15L7.5 10L12.5 5"
                                stroke="#030303"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="text-sm font-medium text-[#030303] font-poppins">
                            Previous
                        </span>
                    </button>

                    {/* Page Info */}
                    <div className="flex flex-col items-center justify-center flex-1 bg-white border-t border-t-[rgba(230,230,230,0.8)]">
                        <div className="flex items-center justify-center py-[9px] px-2">
                            <span className="text-sm font-medium text-[#0177E7] font-poppins">
                                Page {currentPage} of {totalPages}
                            </span>
                        </div>
                        <div className="w-full h-[1px] bg-[rgba(230,230,230,0.8)]" />
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className="flex items-center justify-center gap-2 px-4 py-[10px] bg-white border-l border-[rgba(230,230,230,0.8)] hover:bg-[rgba(241,241,241,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <span className="text-sm font-medium text-[#030303] font-poppins">
                            Next
                        </span>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M7.5 15L12.5 10L7.5 5"
                                stroke="#030303"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
}
