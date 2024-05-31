import { Container, Row, Col } from "reactstrap";
import "../styles/register.css";

const ChangePassword = ()=>{
  return(
    <div className='w-full max-w-md mx-auto py-3 py-md-4 flex flex-col justify-center items-center h-screen'>

    <div className="title flex flex-col items-center text-center mb-3">
      <h4 className='text-5xl font-bold'>Change password</h4>
    </div>
    <Row>
                <Col lg="6" md="6" sm="12" className="m-auto text-center">
                  <form className="form__group mb-5" >
                    <div className="form__group">
        
        <input type="text" placeholder='Current password' className='items-center border-2 p-2 rounded-md w-full' />
        <input type="text" placeholder='New password' className='border-2 p-2 rounded-md w-full' />
        <input type="text" placeholder='Confirm password' className='border-2 p-2 rounded-md w-full' />

        <button className='addTOCart__btn w-full py-2 mt-3' type='submit'>Update</button>
      </div>

    </form>

    </Col>
    </Row>
    </div>
 )
};

export default ChangePassword;
