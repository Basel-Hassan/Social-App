import type { CommentType } from "../../Types/Coment.type"

export default function TopComment({topComment }:{topComment:CommentType}) {
    const {content , commentCreator , createdAt , image} = topComment
    const {name , photo } = commentCreator
    
  return (
    <div className="mt-4">
          <div className="flex items-start gap-3">
            <img
              src={photo}
              alt={name}
              className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-indigo-100"
            />
 
            <div className="min-w-0 flex-1">
              <div className="rounded-2xl rounded-tl-md bg-slate-100 px-4 py-2.5">
                <p dir="auto" className="text-xs font-semibold text-slate-900">
                  {name}
                </p>
                <p
                  dir="auto"
                  className="mt-0.5 break-words text-sm text-slate-700"
                >
                  {content}
                </p>
                {image && 
                (
                  <img
                    src={image}
                    alt="Comment"
                    loading="lazy"
                    className="mt-2 max-h-48 rounded-xl object-cover"
                  />
                )
                }
              </div>
 
              <p className="mt-1 px-2 text-xs text-slate-400">
                {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
  )
}
