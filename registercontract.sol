// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;
/**
 * @title ServiceRegisty
 */
contract ServiceRegistry {
   
   /* struct Servicelocation {
      string  servicename;
      string ipaddress;
      string extra;
    } */
    //string[][] public stringarar;

  //Servicelocation[]  serloc;
   uint private usernumber;
    //Servicelocation[] public servicelist1;
    mapping(uint => string[]) public  userservicelist;
 
    constructor()  {
   usernumber = 0;
   
  // serloc = [Servicelocation('hello', 'fifty')];
   }
 
   
   
 
   
    function submitRegistry(string[] calldata serviceloc) public returns (uint256) {
        usernumber++;
        for (uint i = 0; i < serviceloc.length; i++) {
            userservicelist[usernumber].push(serviceloc[i]);
            //userservicelist[1][0]
        }
      //userservicelist[usernumber] = serviceloc;
 
     
     return usernumber;
       
    }
   
    function changeRegistry (string[] calldata serviceloc2, uint usr, uint[] calldata servicestochange) public {
      //userservicelist[usr] = serviceloc2;
      for (uint i = 0; i < servicestochange.length; i++) {
            userservicelist[usr][servicestochange[i]] = serviceloc2[i];
 
        }
    }
    function test1 (uint[] memory sss) public pure returns(uint){
 
        return sss[0];
    }
    function listgetter(uint userid) public view returns( string[] memory){
        return userservicelist[userid];
    }
}