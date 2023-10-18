// Replace with the actual contract address and ABI
const contractAddress = '0x62DDC67C7c234991044442e6A4c2F0921668A8aA';
const abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "ownerName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "addProperty",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "propertyId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "newOwnerName",
				"type": "string"
			}
		],
		"name": "buyProperty",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "propertyId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "listPropertyForSale",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "propertyId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "ownerName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "forSale",
				"type": "bool"
			}
		],
		"name": "PropertyAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "propertyId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "forSale",
				"type": "bool"
			}
		],
		"name": "PropertyStatusChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "propertyId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "newOwnerName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "PropertyTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "currentOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPropertyCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "propertyId",
				"type": "uint256"
			}
		],
		"name": "isPropertyForSale",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "properties",
		"outputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "ownerName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "forSale",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
async function addProperty() {
    const ownerName = document.getElementById('ownerName').value;
    const price = document.getElementById('price').value;
    const userAddress = document.getElementById('userAddress').value;
    if (!ownerName || !price || !userAddress) {
        alert('Please provide Owner Name, Price, and User Address');
        return;
    }
    const priceWei = web3.utils.toWei(price.toString(), 'ether');
    const contract = new web3.eth.Contract(abi, contractAddress);

    try {
        await ethereum.enable();
        const fromAddress = userAddress;

        // Call the addProperty function
        contract.methods
            .addProperty(ownerName, priceWei)
            .send({ from: fromAddress, gas: 3000000 })
            .on('transactionHash', (hash) => {
                console.log('Transaction Hash:', hash);
            })
            .on('confirmation', (confirmationNumber, receipt) => {
                console.log('Confirmation:', confirmationNumber, receipt);
                document.getElementById('ownerName').value = '';
                document.getElementById('price').value = '';
                document.getElementById('userAddress').value = '';
                loadProperties();
                alert('Property added successfully!');
            })
            .on('error', (error) => {
                console.error('Transaction Error:', error);
                alert('Error: Property could not be added.');
            });
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while processing your request.');
    }
}

async function updateProperty() {
    const propertyId = document.getElementById('propertyId').value;
    const newPrice = document.getElementById('newPrice').value;
    const userAddress = document.getElementById('updateUserAddress').value;
    if (!propertyId || !newPrice || !userAddress) {
        alert('Please provide Property ID , New Price and User Address');
        return;
    }
    const contract = new web3.eth.Contract(abi, contractAddress);
    try {
        await ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        const fromAddress = userAddress;
        contract.methods
            .listPropertyForSale(propertyId, web3.utils.toWei(newPrice.toString(), 'ether'))
            .send({ from: fromAddress, gas: 3000000 })
            .on('transactionHash', (hash) => {
                console.log('Transaction Hash:', hash);
            })
            .on('confirmation', (confirmationNumber, receipt) => {
                console.log('Confirmation:', confirmationNumber, receipt);
                document.getElementById('propertyId').value = '';
                document.getElementById('newPrice').value = '';
                document.getElementById('updateUserAddress').value = '';
                loadProperties();
                alert('Property listed for sale successfully!');
            })
            .on('error', (error) => {
                console.error('Transaction Error:', error);
                alert('Error: Property could not be listed for sale.');
            });
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while processing your request.');
    }
}

async function buyProperty() {
    const propertyId = document.getElementById('buyPropertyId').value;
    const newOwnerName = document.getElementById('newOwnerName').value;
    const buyerAddress = document.getElementById('buyUserAddress').value;
    const ownerAddress = document.getElementById('buyOwnerAddress').value;
    if (!propertyId || !newOwnerName || !buyerAddress || !ownerAddress) {
        alert('Please provide Property ID, New Owner Name, Buyer Address, and Owner Address');
        return;
    }
    const contract = new web3.eth.Contract(abi, contractAddress);
    try {
        await ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        const buyer = buyerAddress;
        const propertyIdNumber = parseInt(propertyId, 10);
        const property = await contract.methods.properties(propertyIdNumber).call();
        const propertyPrice = property.price;
        const buyerBalance = await web3.eth.getBalance(buyer);
        const buyerBalanceEth = web3.utils.fromWei(buyerBalance, 'ether');
        if (parseFloat(buyerBalanceEth) < parseFloat(web3.utils.fromWei(propertyPrice, 'ether'))) {
            alert('Insufficient funds to buy the property.');
            return;
        }
        await contract.methods.buyProperty(propertyIdNumber, newOwnerName)
            .send({ from: buyer, to: contractAddress, value: propertyPrice, gas: 3000000 })
            .on('transactionHash', (hash) => {
                console.log('Transaction Hash:', hash);
            })
            .on('confirmation', (confirmationNumber, receipt) => {
                console.log('Confirmation:', confirmationNumber, receipt);
                document.getElementById('buyPropertyId').value = '';
                document.getElementById('newOwnerName').value = '';
                document.getElementById('buyUserAddress').value = '';
                document.getElementById('buyOwnerAddress').value = '';
                loadProperties();
                alert('Property bought successfully!');
            })
            .on('error', (error) => {
                console.error('Transaction Error:', error);
                alert('Error: Property could not be bought.');
            });
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while processing your request.');
    }
}

async function loadProperties() {
    const propertyListTable = document.getElementById('propertyListTable');
    const propertyList = document.getElementById('propertyList');
    propertyList.innerHTML = ''; 

    const contract = new web3.eth.Contract(abi, contractAddress);
    const propertyCount = await contract.methods.getPropertyCount().call();

    for (let i = 0; i < propertyCount; i++) {
        const property = await contract.methods.properties(i).call();
        propertyList.innerHTML += `
            <tr>
                <td>${i}</td>
                <td>${property.owner}</td>
                <td>${property.ownerName}</td>
                <td>${web3.utils.fromWei(property.price, 'ether')}</td>
                <td>${property.forSale ? 'Yes' : 'No'}</td>
            </tr>
        `;
    }
}
// Event listeners for form submissions
document.getElementById('addPropertyBtn').addEventListener('click', addProperty);
document.getElementById('updatePropertyBtn').addEventListener('click', updateProperty);
document.getElementById('buyPropertyBtn').addEventListener('click', buyProperty);

// Load and display the list of properties when the page loads
loadProperties();
