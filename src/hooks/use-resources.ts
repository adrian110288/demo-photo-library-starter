import { CloudinaryResource } from "@/types/cloudinary";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type UseResources = {
    initialResources?: Array<CloudinaryResource>;
};

export function useResources(options?: UseResources) {
    const queryClient = useQueryClient();

    const {
        data: resources,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["resources"],
        queryFn: async () => {
            const { data } = await fetch("/api/resources").then((res) =>
                res.json()
            );
            return data;
        },
        initialData: options?.initialResources,
    });

    function addResources(resources: Array<CloudinaryResource>) {
        queryClient.setQueryData(
            ["resources"],
            (old: Array<CloudinaryResource>) => {
                return [...resources, ...old];
            }
        );
        queryClient.invalidateQueries({ queryKey: ["resources"] });
    }

    return {
        resources,
        addResources,
    };
}
