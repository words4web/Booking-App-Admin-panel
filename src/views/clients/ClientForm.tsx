"use client";

import { useFormik } from "formik";
import { useState } from "react";
import { useAuth } from "@/src/services/authManager";
import { UserRoles } from "@/src/enums/roles.enum";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { getClientSchema } from "@/src/schemas/validationSchemas";
import { toast } from "react-toastify";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientFormData, Client } from "@/src/types/client.types";
import { ClientTabsData } from "@/lib/ClientTabsData";
import { useAllCompaniesQuery } from "@/src/services/companyManager/useCompanyQueries";
import { ContactInfoTab } from "./components/ContactInfoTab";
import { LegalInfoTab } from "./components/LegalInfoTab";
import { AddressInfoTab } from "./components/AddressInfoTab";

interface ClientFormProps {
  mode?: "create" | "edit";
  initialData?: Client;
  onSubmit: (data: ClientFormData) => void;
  isPending?: boolean;
}

export function ClientForm({
  mode = "create",
  initialData,
  onSubmit,
  isPending = false,
}: ClientFormProps) {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === UserRoles.SUPER_ADMIN;
  const [activeTab, setActiveTab] = useState("contact");

  const tabOrder = ["contact", "legal", "address"];

  const handleNext = async () => {
    if (activeTab === "contact") {
      formik.setTouched({
        ...formik.touched,
        contactInfo: {
          ...formik.touched.contactInfo,
          email: true,
          phone: true,
        },
      });
    } else if (activeTab === "legal") {
      formik.setTouched({
        ...formik.touched,
        companyId: true,
        legalDetails: {
          ...(formik.touched.legalDetails as any),
          legalName: true,
          registrationNumber: true,
          vatNumber: true,
        },
      });
    }

    await formik.validateForm();

    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    }
  };

  const { data: companiesData } = useAllCompaniesQuery(1, 100);
  const companies = companiesData?.companies || [];

  const formik = useFormik<ClientFormData>({
    initialValues: {
      companyId:
        (typeof initialData?.companyId === "string"
          ? initialData?.companyId
          : initialData?.companyId?._id) || "",
      contactInfo: {
        firstName: initialData?.contactInfo?.firstName || "",
        lastName: initialData?.contactInfo?.lastName || "",
        email: initialData?.contactInfo?.email || "",
        phone: initialData?.contactInfo?.phone || "",
      },
      legalDetails: {
        legalName: initialData?.legalDetails?.legalName || "",
        registrationNumber: initialData?.legalDetails?.registrationNumber || "",
        vatNumber: initialData?.legalDetails?.vatNumber || "",
        vatRegistered: initialData?.legalDetails?.vatRegistered ?? false,
        purchaseOrderNumber:
          initialData?.legalDetails?.purchaseOrderNumber || "",
        // nationalInsuranceNumber:
        //   initialData?.legalDetails.nationalInsuranceNumber || "",
      },
      address: {
        addressLine1: initialData?.address?.addressLine1 || "",
        addressLine2: initialData?.address?.addressLine2 || "",
        city: initialData?.address?.city || "",
        county: initialData?.address?.county || "",
        postcode: initialData?.address?.postcode || "",
        country: initialData?.address?.country || "United Kingdom",
      },
      vatExempt: initialData?.vatExempt ?? true,
    },
    validationSchema: toFormikValidationSchema(getClientSchema(isSuperAdmin)),
    enableReinitialize: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      if (!values.legalDetails.vatRegistered) {
        values.legalDetails.vatNumber = "";
      }
      onSubmit(values);
    },
  });

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = await formik.validateForm();

    if (Object.keys(errors).length > 0) {
      formik.setErrors(errors);

      if (errors.contactInfo) {
        setActiveTab("contact");
      } else if (errors.legalDetails || errors.companyId) {
        setActiveTab("legal");
      } else if (errors.address) {
        setActiveTab("address");
      }

      toast.error("Please fill in all required fields correctly.");

      formik.setTouched({
        companyId: true,
        contactInfo: {
          email: true,
          phone: true,
        },
        legalDetails: {
          legalName: true,
          registrationNumber: true,
        },
        address: {
          addressLine1: true,
          city: true,
          postcode: true,
        },
      });
      return;
    }

    formik.handleSubmit(e);
  };

  const getFieldError = (fieldPath: string) => {
    const meta = formik.getFieldMeta(fieldPath);
    return (meta.touched || formik.submitCount > 0) && meta.error
      ? meta.error
      : null;
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4">
      <div className="flex flex-col gap-1 relative mb-10">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {mode === "create" ? "Register New" : "Edit"}{" "}
            <span className="text-primary">Client</span>
          </h1>
        </div>
        <p className="text-muted-foreground font-medium text-sm">
          {mode === "create"
            ? "Provide the required details to add a new client."
            : "Update the client profile details."}
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50 backdrop-blur-xl rounded-[2.5rem]">
          <Tabs value={activeTab} className="w-full">
            <div className="px-4 sm:px-8 pt-6 sm:pt-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
              <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl w-full flex min-w-min">
                {ClientTabsData?.map((data) => (
                  <TabsTrigger
                    key={data?.id}
                    value={data?.id}
                    className="flex-1 rounded-xl px-4 sm:px-6 py-2.5 font-bold text-xs uppercase tracking-widest transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg pointer-events-none">
                    {data?.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <CardContent className="p-8">
              {/* Tab 1: Contact Info */}
              <ContactInfoTab
                formik={formik}
                getFieldError={getFieldError}
                handleNext={handleNext}
              />

              {/* Tab 2: Legal & Business */}
              <LegalInfoTab
                formik={formik}
                getFieldError={getFieldError}
                handleNext={handleNext}
                handleBack={handleBack}
                isSuperAdmin={isSuperAdmin}
                companies={companies}
                mode={mode}
              />

              {/* Tab 3: Address */}
              <AddressInfoTab
                formik={formik}
                getFieldError={getFieldError}
                handleBack={handleBack}
                isPending={isPending}
                mode={mode}
              />
            </CardContent>
          </Tabs>
        </Card>
      </form>
    </div>
  );
}
