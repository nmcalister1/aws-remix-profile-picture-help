import { LoaderFunctionArgs, json, redirect } from "@remix-run/node"
import { useLoaderData, useNavigate } from "@remix-run/react"
import { useState } from "react"
import { ImageUploader } from "~/components/imageUploader"
import { UserCircle } from "~/components/userCircle"
import { getUser, getUserId } from "~/utils/session.server"

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const userId = await getUserId(request)
    const user = await getUser(request)
  
    if (!userId){
      throw redirect("/login")
    }
  
    return json({ user })
}




export default function ProfileRoute(){
  const data = useLoaderData<typeof loader>()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    profilePicture: data?.user?.profilePicture || ''
  })

  const handleFileUpload = async (file: File) => {
    let inputFormData = new FormData()
    inputFormData.append('profile-pic', file)
  
    const response = await fetch('/avatar', {
      method: "POST",
      body: inputFormData
    })
  
    const { imageUrl } = await response.json()
  
    setFormData({
      ...formData,
      profilePicture: imageUrl
    })
    navigate('.', { replace: true })
  }

    return (
      
        <div>
          <h1>Profile Settings</h1>
            <label htmlFor="username">Username</label>
            <input name="username" id="username" readOnly value={data?.user?.username}  />
            <UserCircle user={data?.user} className="h-24 w-24 mx-auto flex-shrink-0" />
            <ImageUploader onChange={handleFileUpload} imageUrl={formData.profilePicture || ''} />
        </div>
    )
}