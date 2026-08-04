import {
    restaurantTemplate,
    serviceTemplate,
    lawnCareTemplate,
} from "./templates";

import { Business } from "@/features/businesses/types";


export function getWebsiteTemplate(
    business: Partial<Business>
) {

    if (business.type === "restaurant") {
        return restaurantTemplate;
    }


    if (
        business.type === "lawn_care" ||
        business.type === "landscaping"
    ) {
        return lawnCareTemplate;
    }


    return serviceTemplate;
}