import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async (props = {}) => {
        try {
            setErrors(null);
            const response = await axios(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { ...body, ...props },
            });

            const data = response.data;

            if (onSuccess) {
                await onSuccess(data);
            }

            return data;
        }
        catch (err) {
            const requestErrors = err.response?.data?.errors || [
                { message: 'Something went wrong. Please try again.' },
            ];

            setErrors(
                <div className="alert alert-danger">
                    <ul> 
                        {requestErrors.map((err, index) => (
                            <li key={index}>{err.message}</li>
                        ))}
                    </ul>
                </div>

            );
        }

    }
        return { doRequest, errors };

}

export default useRequest;
