import React from 'react';
import useRequest from '../../hooks/use-request';
import {useState} from 'react';
import Router from 'next/router';
const newticket = () => {
   const [title, setTitle] = useState('');
   const [price, setPrice] = useState('');

    const submithandle = async (e) => {
        e.preventDefault();
        await doRequest();
    }


    const {doRequest, errors} = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: {
            title, price
        },
        onSuccess: () => Router.push('/')
    }); 


    const onBlur = () => {
        const value = parseFloat(price);
        if(isNaN(value)){
            return;
        }
        setPrice(value.toFixed(2));
    }   


  return(
    <div>
        <h1>Create a  Ticket</h1>
        <form onSubmit={submithandle}>
            <div className="form-group">
                <label>Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} required className="form-control" />
            </div>
            <div className="form-group">
                <label>Price</label>
                <input onBlur={onBlur} value={price} onChange={(e) => setPrice(e.target.value)} type="number" min="0" step="0.01" required className="form-control" />
            </div>
            {errors}
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
        </div>
  );
};

export default newticket;
