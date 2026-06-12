import AddJobForm from "@/components/forms/add-jobs-form"

import { getCities } from "@/server/city"
export const dynamic = "force-dynamic"
export default async function Page() {
  const cities = await getCities()
  return (
    <>
      <div className="text-sm leading-loose">
        <h1 className="mb-2 text-2xl font-medium">Add Job</h1>
        <p>This page allows you to add a new job to the list.</p>
      </div>
      <AddJobForm cities={cities?.data || []} />
    </>
  )
}
