import { Camera, Clock, DollarSign, Tag } from "lucide-react";
import { Project } from "@/lib/data/projects";

interface ProjectShowcaseProps {
  projects: Project[];
  businessName: string;
}

export default function ProjectShowcase({ projects, businessName }: ProjectShowcaseProps) {
  if (projects.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <Camera className="h-5 w-5 text-primary-600" aria-hidden="true" />
        Project Portfolio
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Recent work by {businessName}
      </p>

      <div className="mt-4 space-y-6">
        {projects.map((project) => (
          <div key={project.id} className="card overflow-hidden">
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{project.description}</p>

              {/* Before / After */}
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-red-600">
                    Before
                  </span>
                  <div className="mt-2 aspect-video rounded bg-red-100 flex items-center justify-center text-red-300 text-sm">
                    Before Photo
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{project.beforeDescription}</p>
                </div>
                <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-green-600">
                    After
                  </span>
                  <div className="mt-2 aspect-video rounded bg-green-100 flex items-center justify-center text-green-300 text-sm">
                    After Photo
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{project.afterDescription}</p>
                </div>
              </div>

              {/* Project Details */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                {project.cost && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-gray-400" aria-hidden="true" />
                    {project.cost}
                  </span>
                )}
                {project.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" aria-hidden="true" />
                    {project.duration}
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-beige-100 px-2.5 py-0.5 text-xs text-beige-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
