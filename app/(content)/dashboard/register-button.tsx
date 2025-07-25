import { Plus } from "lucide-react";
import { useState } from "react";

export default function RegisterButton() {
    const [ label, setLabel ] = useState<string>("");
    const [ acquisitionCode, setAcquisitionCode ] = useState<string>("");

    return (
        <div>
            <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
              <Plus className="h-4 w-4" />
              Add Device
            </button>
            <form action="">
                <div>
                    <label htmlFor="deviceLabel">
                        Device Label
                    </label>
                    <input 
                        id="deviceLabel"
                        type="text" 
                        className="form-input w-full py-2"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        placeholder="example@example.com"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="acquisitionCode">
                        Acquisition Code
                    </label>
                    <input 
                        id="acquisitionCode"
                        type="text" 
                        className="form-input w-full py-2"
                        value={acquisitionCode}
                        onChange={(e) => setAcquisitionCode(e.target.value)}
                        placeholder="aBCd1234"
                        required
                    />
                </div>
            </form>
        </div>
    );
}
