"use client";
import React from "react";
import Loading from "../Loading";
import { assets } from "@/assets/assets";
import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";

const CreateStores = ({
  storeStatus,
}: {
  storeStatus: { status: string | null };
}) => {
  const { user } = useUser();
  const router = useRouter();
  const { getToken } = useAuth();

  const [storeInfo, setStoreInfo] = useState({
    name: "",
    username: "",
    description: "",
    email: "",
    contact: "",
    address: "",
    image: null as File | null,
  });

  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to submit a store");
      return;
    }

    try {
      const token = await getToken();

      const formData = new FormData();
      formData.append("name", storeInfo.name);
      formData.append("username", storeInfo.username);
      formData.append("description", storeInfo.description);
      formData.append("email", storeInfo.email);
      formData.append("contact", storeInfo.contact);
      formData.append("address", storeInfo.address);
      formData.append("image", storeInfo.image as Blob);

      await axios.post("/api/store/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Store submitted successfully");
    } catch (error: unknown) {
      console.log(error);
      toast.error(
        (error as { response?: { data?: { error?: string } } }).response?.data
          ?.error || "An error occurred while submitting the store"
      );
    }
  };

  const status = storeStatus?.status; // can be null

  const isSubmitted =
    status === "approved" ||
    status === "pending" ||
    status === "rejected";

  let message = "";

  if (status === "approved") {
    message =
      "Your store has been approved! You can now access your seller dashboard.";
  } else if (status === "pending") {
    message =
      "Your store application is under review. We will notify you once it's approved.";
  } else if (status === "rejected") {
    message =
      "Unfortunately, your store application was rejected. Please contact support.";
  } else {
    message = "You have not submitted a store yet.";
  }

  useEffect(() => {
    if (status === "approved") {
      const timer = setTimeout(() => {
        router.push("/seller/dashboard");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [status, router]);  

  if (!user) {
    return (
      <div className="min-h-[80vh] w-full flex items-center justify-center text-slate-400">
        <h1 className="text-2xl md:text-4xl font-semibold">
          Please <span className="text-slate-500">Login</span> to Continue
        </h1>
      </div>
    );
  }

  if (!storeStatus) {
    return <Loading />;
  }

  return (
    <>
      {!isSubmitted ? (
        <div className="mx-6 min-h-[70vh] my-16">
          <form
            onSubmit={(e) =>
              toast.promise(onSubmitHandler(e), {
                loading: "Submitting data...",
              })
            }
            className="max-w-7xl mx-auto flex flex-col items-start gap-3 text-slate-500"
          >
            <div>
              <h1 className="text-3xl">
                Add Your{" "}
                <span className="text-slate-800 font-medium">Store</span>
              </h1>
              <p className="max-w-lg">
                To become a seller on GoCart, submit your store details for
                review.
              </p>
            </div>

            <label className="mt-10 cursor-pointer">
              Store Logo
              <Image
                src={
                  storeInfo.image
                    ? URL.createObjectURL(storeInfo.image)
                    : assets.upload_area
                }
                className="rounded-lg mt-2 h-16 w-auto"
                alt=""
                width={150}
                height={100}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setStoreInfo({
                      ...storeInfo,
                      image: e.target.files[0],
                    });
                  }
                }}
                hidden
              />
            </label>

            <input
              name="username"
              onChange={onChangeHandler}
              value={storeInfo.username}
              placeholder="Username"
              className="border p-2 w-full max-w-lg"
            />

            <input
              name="name"
              onChange={onChangeHandler}
              value={storeInfo.name}
              placeholder="Store Name"
              className="border p-2 w-full max-w-lg"
            />

            <textarea
              name="description"
              onChange={onChangeHandler}
              value={storeInfo.description}
              placeholder="Description"
              className="border p-2 w-full max-w-lg"
            />

            <input
              name="email"
              onChange={onChangeHandler}
              value={storeInfo.email}
              placeholder="Email"
              className="border p-2 w-full max-w-lg"
            />

            <input
              name="contact"
              onChange={onChangeHandler}
              value={storeInfo.contact}
              placeholder="Contact"
              className="border p-2 w-full max-w-lg"
            />

            <textarea
              name="address"
              onChange={onChangeHandler}
              value={storeInfo.address}
              placeholder="Address"
              className="border p-2 w-full max-w-lg"
            />

            <button className="bg-slate-800 text-white px-12 py-2 rounded mt-10">
              Submit
            </button>
          </form>
        </div>
      ) : (
        <div className="min-h-[80vh] flex flex-col items-center justify-center">
          <p className="text-2xl font-semibold text-slate-500 text-center max-w-2xl">
            {message}
          </p>

          {status === "approved" && (
            <p className="mt-5 text-slate-400">
              redirecting to dashboard in{" "}
              <span className="font-semibold">5 seconds</span>
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default CreateStores;