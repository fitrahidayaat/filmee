import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaUserCircle, FaSignOutAlt, FaSearch, FaBars, FaTimes, FaStar, FaPaperPlane, FaThumbsUp, FaThumbsDown, FaRegThumbsUp, FaRegThumbsDown, FaEyeSlash } from "react-icons/fa";
import { filmee_backend } from "../../../../declarations/filmee_backend";
import { useAuth } from "../../Hooks/authHook";

export default function ReviewBox({ review, isHideSpoiler }) {
  const [name, setName] = useState();
  const [image, setImage] = useState();
  const [showSpoiler, setShowSpoiler] = useState(false);
  const { principal } = useAuth();
  const [user, setUser] = useState();
  const [isUpvoted, setIsUpvoted] = useState(review.upVote.includes(review.principalId));
  const [isDownvoted, setIsDownvoted] = useState(review.downVote.includes(review.principalId));

  useEffect(() => {
    const fetch = async () => {
      const user = await filmee_backend.getUserById(review.principalId);
      setUser(user);
      setName(user[0].username);
      const blob = new Blob([user[0].profilePic[0]]);
      const url = URL.createObjectURL(blob);
      setImage(url);
    }
    fetch();
  }, [])

  const reviewDate = new Date(Number(review.date));
  const formattedDate = reviewDate.toLocaleDateString('en-GB');

  const handleUpvote = async () => {
    const res = await filmee_backend.toggleUpvote(principal.toText(), review.id);
    setIsUpvoted((prev) => !prev);
    if (review.upVote.includes(principal.toText())) {
        // Remove if exists
        review.upVote = review.upVote.filter(id => id !== principal.toText());
    } else {
        // Add if doesn't exist
        review.upVote = [...review.upVote, principal.toText()];
    }
    console.log(res);
  };

  const handleDownvote = async () => {
    const res = await filmee_backend.toggleDownvote(principal.toText(), review.id);
    setIsDownvoted((prev) => !prev);
    if (review.downVote.includes(principal.toText())) {
        // Remove if exists
        review.downVote = review.downVote.filter(id => id !== principal.toText());
    } else {
        // Add if doesn't exist
        review.downVote = [...review.downVote, principal.toText()];
    }
    console.log(res);
  };

  const renderComment = () => {
    if (review.isSpoiler && isHideSpoiler && !showSpoiler) {
      return (
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-gray-600">
            <FaEyeSlash className="text-lg" />
            <p>This review contains spoilers.</p>
            <button
              onClick={() => setShowSpoiler(true)}
              className="text-blue-500 hover:text-blue-700 font-medium ml-2"
            >
              Show anyway
            </button>
          </div>
        </div>
      );
    }
    return <p className="">"{review.comment}"</p>;
  };

  return (
    <div className="flex gap-8 mt-10  rounded-lg shadow-sm">
      {user && user[0].profilePic[0] ? <img src={image} alt="profile pic" className="rounded-full h-20 w-20 object-cover" /> : <FaUserCircle className="w-22 h-22"/>}
      
      <div className="w-full flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-gray-500 text-sm">{formattedDate}</p>
        </div>
        {renderComment()}
        <div className="flex gap-4 mt-2">
          <button className="flex items-center gap-2 hover:text-blue-600 transition-colors" onClick={handleUpvote}>
            {isUpvoted ? <FaThumbsUp/> : <FaRegThumbsUp className="text-lg" />}
            
            <span>{review.upVote.length}</span>
          </button>
          <button className="flex items-center gap-2 hover:text-red-600 transition-colors" onClick={handleDownvote}>
            {isDownvoted ? <FaThumbsDown/> : <FaRegThumbsDown className="text-lg" />}
            <span>{review.downVote.length}</span>
          </button>
        </div>
      </div>
    </div>
  );
}