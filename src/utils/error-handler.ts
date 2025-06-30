import axios from "axios";

export function handleAxiosError(error: unknown): any {
  if (axios.isAxiosError(error)) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log(error.response);
        // console.log(`Server Error: ${error.response.status} - ${error.response.data}`);

        if (error.response.status === 400) {
          console.log(400);
          if (error.response.data.code === 11000) {
            const key = Object.keys(error.response.data.keyValue)[0];

            // toast.error(`"${error.response.data.keyValue[key]}" is already existed.`, {
            //   position: "top-right",
            //   autoClose: 5000,
            //   hideProgressBar: false,
            //   closeOnClick: false,
            //   pauseOnHover: true,
            //   draggable: true,
            //   progress: undefined,
            //   theme: "colored",
            //   transition: Slide,
            // });

            return {
              key: key,
              message: `${error.response.data.keyValue[key]} is already existed.`,
            };
          } else if (error.response.data.errors) {
            console.log(error.response.data.errors);
            const key = Object.keys(error.response.data.errors)[0];
            let message = "";
            if (error.response.data.errors[key].kind === "required") {
              message = "This field is required.";
            }
            return { key: key, message: message };
          }

          return undefined;
        }

        return undefined;
      } else if (error.request) {
        console.error("No response received:", error.request);
        return undefined;
      } else {
        console.error("Axios Error:", error.message);
        return undefined;
      }
    } else {
      console.error("Unexpected error:", error);
      return undefined;
    }
  }
}
