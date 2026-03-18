import API_ENDPOINTS from "@/lib/Api_Endpoints";
import api from "../../lib/axios";
import { ApiResponse } from "../../types/api.types";
import { ICMSContent, IUpsertCMSRequest } from "../../types/cms.types";

export const CMSService = {
  getAllContent: async (): Promise<ApiResponse<ICMSContent[]>> => {
    const response = await api.get(API_ENDPOINTS.CMS.GET_ALL);
    return response.data;
  },

  getContentBySlug: async (slug: string): Promise<ApiResponse<ICMSContent>> => {
    const response = await api.get(API_ENDPOINTS.CMS.GET_BY_SLUG(slug));
    return response.data;
  },

  upsertContent: async (data: IUpsertCMSRequest): Promise<ApiResponse<ICMSContent>> => {
    const response = await api.post(API_ENDPOINTS.CMS.UPSERT, data);
    return response.data;
  },
};
