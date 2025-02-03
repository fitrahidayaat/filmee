import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { filmee_backend } from "../../../../declarations/filmee_backend";

export default function Search() {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search/${searchTerm}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex">
            <input
                type="text"
                placeholder="Search..."
                name="search"
                className="bg-transparent text-white outline-none placeholder-gray-400 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="cursor-pointer">
                <FaSearch className="text-gray-400" />
            </button>
        </form>
    );
}