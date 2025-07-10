import leftArrow from "../../assets/leftArrow.png";
import rightArrow from "../../assets/rightArrow.png";

const PaginationData = ({ page, maxPages, setPage }) => {
    return (
        <div className="flex justify-center mt-4 gap-4 items-center">
            <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
            >
                <img
                    src={leftArrow}
                    alt="Previous"
                    className={`w-6 h-6 ${page === 1 ? "opacity-30" : "hover:opacity-80 cursor-pointer"}`}
                />
            </button>
            <span className="text-sm text-gray-700">
                <span className="text-gray-500">{page}</span> of <span className="text-black-700 font-semibold">{maxPages}</span>
            </span>
            <button
                onClick={() => setPage((p) => (p < maxPages ? p + 1 : p))}
                disabled={page >= maxPages}
            >
                <img
                    src={rightArrow}
                    alt="Next"
                    className={`w-6 h-6 ${page >= maxPages ? "opacity-30" : "hover:opacity-80 cursor-pointer"}`}
                />
            </button>
        </div>
    );
};

export default PaginationData;