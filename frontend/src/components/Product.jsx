import React from 'react'

export default function Product() {
  
  
  return (    
    <div className='fixed w-full  h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
       <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>

            <div className='flex justify-between items-center pb-3'>
                <h2 className='font-bold text-lg'>Upload Product</h2>
                <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' >                  
                </div>
            </div>

          <form className='grid p-4 gap-2 overflow-y-scroll h-full pb-5' >
            <label htmlFor='productName'>Product Name :</label>
            <input 
              type='text' 
              id='productName' 
              placeholder='enter product name' 
              name='productName'
          
              className='p-2 bg-slate-100 border rounded'
              required
            />

            <br></br>


              <label htmlFor='category' className='mt-3'>Category :</label>
              <select required  name='category' className='p-2 bg-slate-100 border rounded'>
                  <option value={""}>Select Category</option>
                  
              </select>

              <br></br>

              <label htmlFor='productImage' className='mt-3'>Product Image :</label>
              <label htmlFor='uploadImageInput'>
              <div className='p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer'>
                        <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>                      
                          <input type='file' id='uploadImageInput'  className='hidden' />
                        </div>
              </div>
              </label> 

              <br></br>

              <label htmlFor='price' className='mt-3'>Price :</label>
              <input 
                type='number' 
                id='price' 
                placeholder='enter price'           
                name='price'          
                className='p-2 bg-slate-100 border rounded'
                required
              />

              <br></br>

              <label htmlFor='description' className='mt-3'>Description :</label>
              <textarea 
                className='h-28 bg-slate-100 border resize-none p-1' 
                placeholder='enter product description'           
                name='description'            
              >
              </textarea>
              <br></br>
              <button className='px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700'>Upload Product</button>
          </form>     
       </div>
    </div>
  )
}
