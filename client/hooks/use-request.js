import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async () => {
        try {
            setErrors(null);
            const response = await axios(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(body)
            });

            // if (!response.ok) {
            //     console.log('Response is not ok:', response);
            //     const errorResponse =response.data;
            //     setErrors(errorResponse.errors);
            //     return;
            // }

            const data = response.data;


            return data;
        }
        catch (err) {
            console.log('Error in mmmmm useRequest:', err.response.data.errors);
            setErrors(
                <div className="alert alert-danger">
                    <ul> 
                        {err.response.data.errors.map((err, index) => (
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