import { motion } from "framer-motion";
import { Heart, BookOpen, Trash2, Clock } from "lucide-react";
import Badge from "../common/Badge";

export default function StoryCard({
  story,
  onOpen,
  onToggleFavorite,
  onDelete,
}) {
  // Calculate reading time
  const readingTime = Math.max(
    1,
    Math.ceil(
      (story.generatedStory
        ? story.generatedStory.split(/\s+/).length
        : 0) / 200
    )
  );

  // Story preview
  const excerpt = story.generatedStory
    ? story.generatedStory.substring(0, 120) + "..."
    : "Story not generated yet.";

  // Date
  const createdDate = story.createdAt
    ? new Date(story.createdAt).toLocaleDateString()
    : "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-red-500/50 transition-all"
    >
      {/* Header */}
      <div className="relative h-32 bg-gradient-to-br from-red-900 via-red-700 to-black flex items-end p-4">
        <Badge tone="primary">{story.genre}</Badge>

        <button
          type="button"
          onClick={() => onToggleFavorite?.(story.id)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur flex items-center justify-center hover:bg-red-600/40 transition"
        >
          <Heart
            size={15}
            className={
              story.favorite
                ? "text-red-500 fill-red-500"
                : "text-white"
            }
          />
        </button>
      </div>

      {/* Body */}
      <div className="p-4">

        <h3 className="font-semibold text-lg text-white truncate">
          {story.title}
        </h3>

        <p className="text-sm text-gray-400 mt-2 line-clamp-3">
          {excerpt}
        </p>

        <div className="flex justify-between items-center mt-4 text-xs text-gray-400">

          <span className="flex items-center gap-1">
            <Clock size={13} />
            {readingTime} min read
          </span>

          <span>{createdDate}</span>

        </div>

        <div className="flex gap-2 mt-5">

          <button
            type="button"
            onClick={() => onOpen(story)}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
          >
            <BookOpen size={15} />
            Read Story
          </button>

          <button
            type="button"
            onClick={() => onDelete(story.id)}
            className="w-10 rounded-lg border border-red-600 text-red-500 hover:bg-red-600 hover:text-white transition flex items-center justify-center"
          >
            <Trash2 size={15} />
          </button>

        </div>

      </div>
    </motion.div>
  );
}