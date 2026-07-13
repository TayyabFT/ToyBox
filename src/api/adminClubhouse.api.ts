import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  buildPrivateLoungeFormData,
  buildPrivateLoungePayload,
  buildRestaurantFormData,
  buildRestaurantPayload,
  buildSuiteLoungeFormData,
  buildSuiteLoungePayload,
  hasClubhouseImages,
} from "@/lib/adminClubhouse";
import type {
  AdminClubhouseRestaurantListResponse,
  CreateAdminClubhouseAreaResponse,
} from "@/types/api";
import type {
  ClubhousePrivateLoungeFormState,
  ClubhouseRestaurantFormState,
  ClubhouseSuiteLoungeFormState,
} from "@/components/admin/clubhouse/add-area/types";

type AdminClubhouseRestaurantsQuery = {
  limit?: number;
  offset?: number;
};

export const adminClubhouseApi = {
  getRestaurants: (query: AdminClubhouseRestaurantsQuery = {}) => {
    const params = new URLSearchParams();

    if (query.limit !== undefined) params.set("limit", String(query.limit));
    if (query.offset !== undefined) params.set("offset", String(query.offset));

    const qs = params.toString();
    const endpoint = qs
      ? `${API_ENDPOINTS.adminClubhouse.restaurant}?${qs}`
      : API_ENDPOINTS.adminClubhouse.restaurant;

    return apiClient<AdminClubhouseRestaurantListResponse>(endpoint);
  },

  createRestaurant: (form: ClubhouseRestaurantFormState) => {
    if (hasClubhouseImages(form.ambienceImages)) {
      return apiClient<CreateAdminClubhouseAreaResponse>(
        API_ENDPOINTS.adminClubhouse.restaurant,
        {
          method: "POST",
          formData: buildRestaurantFormData(form),
        },
      );
    }

    return apiClient<CreateAdminClubhouseAreaResponse>(
      API_ENDPOINTS.adminClubhouse.restaurant,
      {
        method: "POST",
        body: buildRestaurantPayload(form),
      },
    );
  },

  createPrivateLounge: (form: ClubhousePrivateLoungeFormState) => {
    if (hasClubhouseImages(form.images)) {
      return apiClient<CreateAdminClubhouseAreaResponse>(
        API_ENDPOINTS.adminClubhouse.privateLounge,
        {
          method: "POST",
          formData: buildPrivateLoungeFormData(form),
        },
      );
    }

    return apiClient<CreateAdminClubhouseAreaResponse>(
      API_ENDPOINTS.adminClubhouse.privateLounge,
      {
        method: "POST",
        body: buildPrivateLoungePayload(form),
      },
    );
  },

  createSuiteLounge: (form: ClubhouseSuiteLoungeFormState) => {
    if (hasClubhouseImages(form.images)) {
      return apiClient<CreateAdminClubhouseAreaResponse>(
        API_ENDPOINTS.adminClubhouse.suiteLounge,
        {
          method: "POST",
          formData: buildSuiteLoungeFormData(form),
        },
      );
    }

    return apiClient<CreateAdminClubhouseAreaResponse>(
      API_ENDPOINTS.adminClubhouse.suiteLounge,
      {
        method: "POST",
        body: buildSuiteLoungePayload(form),
      },
    );
  },
};
