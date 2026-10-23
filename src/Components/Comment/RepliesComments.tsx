import { useNavigate } from "react-router-dom";
import { CommentType } from "../../Types/Coment.type";

export default function RepliesComments({
  replyData,
}: {
  replyData: CommentType;
}) {
  const { content, createdAt, commentCreator, image } = replyData;
  const { name, photo, _id } = commentCreator;
  const navigate = useNavigate();
  return (
    <>
      <div className="mt-3 ml-6 flex items-start gap-2.5">
        <img
          src={photo}
          alt={name}
          onClick={() => {
            navigate(`/profile/${_id}`);
          }}
          className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-indigo-50 cursor-pointer"
        />

        <div className="min-w-0 flex-1">
          <div className="rounded-2xl rounded-tl-md bg-slate-50 px-3.5 py-2 ring-1 ring-slate-100">
            <p
              dir="auto"
              className="text-xs font-semibold text-slate-900 cursor-pointer hover:underline"
              onClick={() => {
                navigate(`/profile/${_id}`);
              }}
            >
              {name}
            </p>
            {content && (
              <p
                dir="auto"
                className="mt-0.5 break-words text-sm text-slate-700"
              >
                {content}
              </p>
            )}

            {image && (
              <img
                src={image}
                className="mt-2 max-h-40 rounded-xl object-cover"
              />
            )}
          </div>

          <div className="mt-1 flex items-center gap-3 px-2">
            <span className="text-xs text-slate-400">
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
