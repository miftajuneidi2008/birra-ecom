import CreateStores from "@/components/store/CreateStore";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";

const fetchSellerStatus = async () => {
  const { getToken } = await auth();
  const token = await getToken();
  const {data} = await axios.get("http://localhost:3000/api/store/create", {
    headers:{
      Authorization: `Bearer ${token}`,
    }
  
})
return data;
}

export default async function CreateStore() {
  const datas = await fetchSellerStatus();
 
return(
  <CreateStores storeStatus = {datas}/>
)
}
