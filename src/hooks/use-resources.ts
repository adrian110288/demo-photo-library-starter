import { CloudinaryResource } from "@/types/cloudinary";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type UseResources = {
    initialResources?: Array<CloudinaryResource>;
    disableFetch?: boolean;
    tag?: string;
};

export function useResources(options?: UseResources) {
    const queryClient = useQueryClient();
    const disableFetch = options?.disableFetch ?? false;

    const { data: resources } = useQuery({
        queryKey: ["resources", options?.tag],
        queryFn: async () => {
            const { data } = await fetch("/api/resources").then((res) =>
                res.json()
            );
            return data;
        },
        initialData: options?.initialResources,
        enabled: !disableFetch,
    });

    function addResources(resources: Array<CloudinaryResource>) {
        queryClient.setQueryData(
            [
                "resources",
                String(process.env.NEXT_PUBLIC_CLOUDINARY_LIBRARY_TAG),
            ],
            (old: Array<CloudinaryResource>) => {
                return [...resources, ...old];
            }
        );
        queryClient.invalidateQueries({
            queryKey: [
                "resources",
                String(process.env.NEXT_PUBLIC_CLOUDINARY_LIBRARY_TAG),
            ],
        });
    }

    return {
        resources,
        addResources,
    };
}
