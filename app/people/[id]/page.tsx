import PeopleForm from "@/components/forms/people-form"
import NotFound from "@/components/ui/not-found"
import { getCities } from "@/server/city"
import { getPeople } from "@/server/people"

interface PageProps {
  params: Promise<{ id: string }>
}
export const dynamic = "force-dynamic"

export default async function Page({ params }: PageProps) {
  const { id } = await params

  const cities = await getCities()

  const peopleData = await getPeople({
    id: id,
  })

  const people = peopleData?.data?.[0]

  if (!people) {
    return (
      <NotFound
        title="People Not found!"
        backHref="/people"
        backLabel="Go Back"
        description="People you are looking for does not exist or has been removed."
      />
    )
  }

  return (
    <>
      <div className="text-sm leading-loose">
        <h1 className="mb-2 text-2xl font-medium">Edit Person</h1>
        <p>This page allows you to edit an existing person in the list.</p>
      </div>
      <PeopleForm
        cities={cities?.data || []}
        isEdit={true}
        initialData={peopleData?.data?.[0] || undefined}
      />
    </>
  )
}
