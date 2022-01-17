// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;
/**
 * @title ServiceRegisty
 * @dev Facilitates the blockchain-based storage and retrieval of service names and their IP addresses 
 */
contract ServiceRegistry {
    //@dev Emits the registerID of newly submitted register
   event newRegistry(    
       uint value        
   );
   //keeps track of number of submitted registers
   uint private usernumber;
    //@dev this mapping is where the registries are stored at in arrays, linked to their respective registry IDs 
    mapping(uint => string[]) public  userservicelist;
 


    constructor()  {
   usernumber = 0;
   }
 
   
   /** 
     * @dev Allows msg.sender to submit registry to the blockchain
     * @param serviceloc is the registry in an array of properly formatted strings: ['exampleservice1 exampleip1', 'exampleservice2 exampleip2']
     */
 
    function submitRegistry(string[] calldata serviceloc) public  {
        usernumber++;
        for (uint i = 0; i < serviceloc.length; i++) {
            userservicelist[usernumber].push(serviceloc[i]);
            
        }
      
    
     emit newRegistry(usernumber);
     
       
    }
   
    /** 
     * @dev Allows client to change already-submitted registry 
     * @param serviceloc2 is an array of properly formatted strings: ['exampleservice1 newip1', 'exampleservice2 newip2'] for each service that
     * msg.sender wishes to change
     * @param usr is the uint representing the registry ID number that msg.sender wants to change
     * @param servicestochange is an array containing the indices (in the registry) of the services msg.sender wishes to change
     * @dev these design of this function (replacing at user supplied indices) was decided upon to reduce to operations required on-chain, as
     * comparing strings by kekkack256 hashing is more resource intensive than this method (which requires more complexity off-chain)
     */

    function changeRegistry (string[] calldata serviceloc2, uint usr, uint[] calldata servicestochange) public {
      
      for (uint i = 0; i < servicestochange.length; i++) {
            userservicelist[usr][servicestochange[i]] = serviceloc2[i];
 
        }
    }

    
     /** 
     * @dev returns service registry to caller when supplied a registry ID
     * @param userid is the uint representing a registry ID number
     */

    function listgetter(uint userid) public view returns( string[] memory){
        return userservicelist[userid];
    }
}
