import React, { useEffect, useState } from "react";

import SelectAddressModal from "./SelectAddressModal/SelectAddressModal";
import AddNewAddressModal from "./AddNewAddressModal/AddNewAddressModal";

const AddressModal = ({ addresses, fetchAllAddresses, selectedAddress, setSelectedAddress, setIsAddressModalOpen }) => {
  const [isAddNewAddressModalOpen, setAddNewAddressModalOpen] = useState(false);

  if (!isAddNewAddressModalOpen) {
    return <SelectAddressModal setAddNewAddressModalOpen={setAddNewAddressModalOpen} fetchAllAddresses={fetchAllAddresses} addresses={addresses} selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} setIsAddressModalOpen={setIsAddressModalOpen}/>;
  } else {
    return <AddNewAddressModal setAddNewAddressModalOpen={setAddNewAddressModalOpen} fetchAllAddresses={fetchAllAddresses} />;
  }
};

export default AddressModal;
