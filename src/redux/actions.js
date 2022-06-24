export const omNameChange = (event) => {
type:"ONNAMECHANGE";
payLoad: {
  nameEntered: event.target.value
}
};



export const getUserDetails = () => {
      type: "GETUSERDETAILS"
  };
  

  export const addAUser = (event) => {
      type: "ADDUSERDETAILS";
      payLoad: {
        id:event.target.id
      }
  };

  export const deleteAUser = (event) => {
      type: "DELETEAUSER";
      payLoad:{
        id:event.target.id
      }
  };


  export const updateAUser = (event) => {
      type: "UPDATEAUSER";
      payLoad:{
        id:event.target.id
      }
  };
  