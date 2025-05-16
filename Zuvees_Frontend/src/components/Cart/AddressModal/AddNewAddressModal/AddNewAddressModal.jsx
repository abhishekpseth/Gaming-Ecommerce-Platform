import React, { useState } from "react";
import { GoArrowLeft } from "react-icons/go";

import UserService from "../../../../services/user.service";

import useNotification from "../../../../custom-hooks/useNotification";

import InputBox from "../../../Common/InputBox/InputBox";
import LoadingLight from "../../../Common/LoadingLight/LoadingLight";

const AddNewAddressModal = ({setAddNewAddressModalOpen, fetchAllAddresses}) => {
  const showNotification = useNotification();
  const [saveAddressLoading, setSaveAddressLoading] = useState(false);

  const [addressForm, setAddressForm] = useState({
    name: "",
    mobileNumber: "",
    pinCode: "",
    address: "",
    locality: "",
    district: "",
    state: "",
    addressTag: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaveAddressLoading(true);
    UserService.addAddress(addressForm)
    .then((res)=>{
      if(res.status === 201){
        showNotification("success", "Address Updated Successfully");
        fetchAllAddresses();
        setAddNewAddressModalOpen(false);
      }else{
        showNotification("error", "Couldn't update address");
      }
    })
    .catch((error)=>{
      console.log(error);
      showNotification("error");
    })
    .finally(()=>{
      setSaveAddressLoading(false);
    });
  };

  return (
    <div
      className="absolute top-0 left-0 z-30 flex items-start justify-center w-full h-screen overflow-hidden pt-[20px]"
      style={{
        backgroundColor: "rgba(83, 83, 83, 0.35)",
      }}
    >
      <div className="bg-white w-[400px] h-[80%] rounded-md relative flex flex-col gap-2">
        {/* Header */}
        <div className="flex items-center justify-start gap-3 p-4 border border-b-gray-300">
          <GoArrowLeft onClick={() => setAddNewAddressModalOpen(false)} className="text-2xl cursor-pointer" />
          <div className="text-sm font-bold text-gray-600">ADD NEW ADDRESS</div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 overflow-hidden">
          <div className="flex flex-col gap-4 px-4 py-6 overflow-auto invisible-scrollbar">
            <div>
              <div className="mb-2 text-xs font-extrabold text-gray-800">CONTACT DETAILS</div>
              <InputBox label="Name*" value={addressForm.name} onChange={handleChange} type="text" name="name" />
              <InputBox label="Mobile No*" value={addressForm.mobileNumber} onChange={handleChange} type="tel" name="mobileNumber" />
            </div>

            <div>
              <div className="mb-2 text-xs font-extrabold text-gray-800">ADDRESS DETAILS</div>
              <InputBox label="Address Tag" value={addressForm.addressTag} onChange={handleChange} type="text" name="addressTag" required={false} />
              <InputBox label="Pin Code*" value={addressForm.pinCode} onChange={handleChange} type="text" name="pinCode" />
              <InputBox label="Address*" value={addressForm.address} onChange={handleChange} type="text" name="address" />
              <InputBox label="Locality/Town*" value={addressForm.locality} onChange={handleChange} type="text" name="locality" />
              <InputBox label="District*" value={addressForm.district} onChange={handleChange} type="text" name="district" />
              <InputBox label="State*" value={addressForm.state} onChange={handleChange} type="text" name="state" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between gap-2 px-4 pt-4 pb-2" style={{ boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.2)" }}>
            <button onClick={() => setAddNewAddressModalOpen(false)} className="flex-1 py-3 text-[16px] font-bold text-gray-600 bg-white border border-gray-200 rounded-xl">
              Cancel
            </button>
            <button className="flex items-center justify-center gap-3 flex-1 py-3 text-white bg-pink-600 border text-[16px] font-bold rounded-xl">
              {saveAddressLoading && (
                <div className="relative w-4 h-4">
                  <LoadingLight />
                </div>
              )}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewAddressModal;
