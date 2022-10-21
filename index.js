import * as React from "react";
import { enMessages } from "./../../messages/en-US";
import Stramdata from './stramdata.component';
const StreamData = () => {
  const PageTitle = enMessages["page_title"]["StreamData"];
  return (
    <div id="page">
      <div>
        <h3 align="left" id="heading">
          {PageTitle}
        </h3>
        {/* <p className="PageTitle_Line" align="left">
          Manage all the projects
        </p> */}
        <hr className="PageTitle_Line" />
        <Stramdata/>
      </div>
    </div>
  );
};
export default StreamData;
