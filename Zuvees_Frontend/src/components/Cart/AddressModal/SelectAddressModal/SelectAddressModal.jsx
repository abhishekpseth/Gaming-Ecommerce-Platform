import React, { useState } from "react";

import { RxCross1 } from "react-icons/rx";
import { FaRegTrashAlt } from "react-icons/fa";
import UserService from "../../../../services/user.service";
import useNotification from "../../../../custom-hooks/useNotification";

const SelectAddressModal = ({ setAddNewAddressModalOpen, fetchAllAddresses, addresses, selectedAddress, setSelectedAddress, setIsAddressModalOpen }) => {
  const showNotification = useNotification();
  const [deleteAddressLoading, setDeleteAddressLoading] = useState(false);
  
  const deleteAddress = (addressID) =>{
    setDeleteAddressLoading(true);
    UserService.deleteAddress(addressID)
    .then((res)=>{
      if(res.status === 200){
        showNotification("success", "Address Deleted");
        fetchAllAddresses();
      }else{
        showNotification("error", "Couldn't delete address");
      }
    })
    .catch((error)=>{
      console.log(error);
      showNotification("error");
    })
    .finally(()=>{
      setDeleteAddressLoading(false);
    })
  }
  
  return (
    <div
      className="absolute top-0 left-0 z-30 px-4 flex items-start justify-center w-full h-screen pt-[40px] overflow-hidden"
      style={{
        backgroundColor: "rgba(83, 83, 83, 0.35)",
      }}
    >
      <div className="bg-white w-[500px] p-2 rounded-md relative flex flex-col gap-2 overflow-hidden">
        <div className="flex items-center justify-between p-2">
          <div className="text-lg font-bold">Select Delivery Address</div>
          <RxCross1 onClick={() => setIsAddressModalOpen(false)} className="text-lg cursor-pointer" />
        </div>
        <div className="flex justify-between w-full px-3 py-4 bg-gray-100">
          <div>{Array.isArray(addresses) && addresses.length > 0 && <div className="text-sm font-bold text-gray-600">SAVED ADDRESSES</div>}</div>
          <div onClick={() => setAddNewAddressModalOpen(true)} className="text-sm font-bold text-pink-600 cursor-pointer">
            + ADD NEW ADDRESS
          </div>
        </div>

        <div className="overflow-auto max-h-[200px] lg:max-h-[400px] invisible-scrollbar bg-gray-100">
          {addresses.map((address) => (
            <div key={address?._id} className="flex flex-col p-2 pb-0">
              <div
                className="flex bg-white rounded-lg cursor-pointer hover:border hover:border-pink-600"
                onClick={() => {
                  setSelectedAddress(address?._id);
                  setIsAddressModalOpen(false);
                }}
              >
                <div className="flex items-start p-2 pt-4">
                  <div className="grid w-5 h-5 border border-pink-600 rounded-full place-content-center">
                    {selectedAddress == address?._id && <div className="w-3 h-3 bg-pink-600 rounded-full">&nbsp;</div>}
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between p-2">
                    <div className="text-sm font-bold text-gray-800">{address.name}</div>
                    <div className="px-2 py-0 border border-teal-500 font-bold text-teal-500 rounded-full text-[12px] flex items-center justify-center">{address.addressTag}</div>
                  </div>
                  <div className="flex flex-col gap-2 px-2 py-2 text-sm text-gray-600">
                    <div className="break-words">
                      {address.name}, {address.locality}, {address.district}, {address.state} - {address.pinCode}
                    </div>
                    <div className="flex gap-2">
                      Mobile: <div className="font-bold text-gray-800">{address.mobileNumber}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>{selectedAddress === address?._id && <div className="px-3 py-2 text-sm font-bold text-gray-800 bg-gray-200">Delivering Here</div>}</div>
                      <div onClick={() => deleteAddress(address?._id)} className="grid w-10 h-8 border border-gray-800 rounded-md hover:border-green-600 place-content-center">
                        {deleteAddressLoading ? "Loading..." : <FaRegTrashAlt className="w-5 h-5 text-gray-800" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between w-full h-[8px] bg-gray-100">&nbsp;</div>
            </div>
          ))}
        </div>
        <div className="w-full p-1 bg-white">
          <div
            onClick={() => setAddNewAddressModalOpen(true)}
            className="grid h-full py-3 text-xs font-bold text-gray-800 border border-gray-800 rounded-md cursor-pointer place-content-center hover:border-pink-600 hover:text-pink-600"
          >
            ADD NEW ADDRESS
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectAddressModal;
