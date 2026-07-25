import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ReadStory() {

    const { state } = useLocation();
    const navigate = useNavigate();

    const story = state?.story;

    if (!story) {
        return (
            <div className="flex justify-center items-center h-screen text-white">
                Story not found.
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-6">

            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 mb-8 text-gray-400 hover:text-white"
            >
                <ArrowLeft size={18} />
                Back
            </button>

            <h1 className="text-4xl font-bold mb-3">
                {story.title}
            </h1>

            <div className="flex gap-3 mb-8">

                <span className="px-3 py-1 rounded-full bg-red-600 text-white text-sm">
                    {story.genre}
                </span>

                <span className="text-gray-400">
                    {new Date(story.createdAt).toLocaleDateString()}
                </span>

            </div>

            <div
                className="leading-8 text-lg whitespace-pre-wrap text-gray-200"
            >
                {story.generatedStory}
            </div>

        </div>
    );
}