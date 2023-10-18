// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RealEstateContract {
    struct Property {
        address owner;
        string ownerName;
        uint price;
        bool forSale;
    }

    Property[] public properties;
    address owner;

    event PropertyAdded(uint indexed propertyId, string ownerName, uint price, bool forSale);
    event PropertyTransferred(uint indexed propertyId, address from, address to, string newOwnerName, uint price);
    event PropertyStatusChanged(uint indexed propertyId, bool forSale);
    
    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this!");
        _;
    }

    function addProperty(string memory ownerName, uint price) public {
        properties.push(Property(msg.sender, ownerName, price, true));
        uint propertyId = properties.length - 1;
        emit PropertyAdded(propertyId, ownerName, price, true);
    }

    function buyProperty(uint propertyId, string memory newOwnerName) public payable {
        require(propertyId < properties.length, "Property does not exist");
        Property storage property = properties[propertyId];
        require(property.forSale, "Property is not for sale");
        require(msg.value >= property.price, "Insufficient funds");
        
        // Calculate the amount to be transferred to the owner
        uint price = property.price;
        uint excess = msg.value - price;

        address previousOwner = property.owner;
        property.owner = msg.sender;
        property.forSale = false;
        property.ownerName = newOwnerName;

        // Transfer the property price to the owner
        payable(previousOwner).transfer(price);
        
        // Refund any excess to the buyer
        if (excess > 0) {
            payable(msg.sender).transfer(excess);
        }
        
        emit PropertyTransferred(propertyId, previousOwner, msg.sender, newOwnerName, price);
        emit PropertyStatusChanged(propertyId, false);
    }

    function listPropertyForSale(uint propertyId, uint price) public {
        require(propertyId < properties.length, "Property does not exist");
        Property storage property = properties[propertyId];
        require(property.owner == msg.sender, "You don't own this property");
        property.forSale = true;
        property.price = price;
        emit PropertyStatusChanged(propertyId, true);
    }

    function getPropertyCount() public view returns (uint) {
        return properties.length;
    }

    function currentOwner() public view returns (address) {
        return msg.sender;
    }

    function isPropertyForSale(uint propertyId) public view returns (bool) {
        require(propertyId < properties.length, "Property does not exist");
        Property storage property = properties[propertyId];
        return property.forSale;
    }

    function getBalance(address _address) public view returns (uint) {
        return _address.balance;
    }
}
