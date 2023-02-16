import Head from "next/head";
import { useEffect, useState } from "react";
import Image from "next/image";
import mockJson from "../mockData.json";

const headers = ["", "NAME", "DATE OF BIRTH", "CITY", "COUNTRY", ""];
const TABLE_DATA = "TABLE_DATA";
export default function Home() {
  const [newName, setNewName] = useState("");
  const [tableData, setTableData] = useState<any[]>([]);
  const [editMode, setEditMode] = useState<any>({
    id: "",
    editable: false,
    newName: "",
  });

  useEffect(() => {
    if (editMode.id) {
      const copyTable = tableData;
      const foundItem = copyTable.find((item) => item.id === editMode.id);
      if (foundItem) {
        const foundIndex = copyTable.findIndex(
          (item) => item.id === foundItem.id
        );
        foundItem.editable = true;
        foundItem.name = newName;
        copyTable[foundIndex] = foundItem;
        setTableData(copyTable);
      }
    }
  }, [editMode.id]);

  useEffect(() => {
    // try {
    //   const data = JSON.parse(localStorage.getItem(TABLE_DATA) as any);
    //   if (data) {
    //     setTableData(data);
    //   } else {
    //     getData();
    //   }
    // } catch (error) {
    //   /// error
    // }
    setTableData(mockJson);
  }, []);

  const getData = async () => {
    const BASE_URL =
      "https://63998da716b0fdad77409a5e.mockapi.io/api/v1/hikers";
    const request = await fetch(BASE_URL);
    const json = await request.json();
    if (json) {
      setTableData(json);
      localStorage.setItem(TABLE_DATA, json);
    } else {
      localStorage.setItem(TABLE_DATA, JSON.stringify(mockJson));
    }
  };

  const onDelete = (id: string) => {
    const foundItem = tableData.find((item: any) => item.id === id);
    if (foundItem) {
      alert(`Are you sure you want to delete ${foundItem.name}?`);
    }
  };

  return (
    <>
      <Head>
        <title>SD Worx Assignment</title>
      </Head>
      <main style={{}}>
        <h1>Attendees({tableData.length})</h1>
        <table className="table-auto">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <td key={header + index}>{header}</td>
              ))}
            </tr>
          </thead>
          <tbody className="flex-auto">
            {tableData.slice(0, 10).map((item, index) => (
              <tr key={item + index}>
                <td>{item.id}</td>
                <td>
                  <Image
                    width={24}
                    height={24}
                    src={item.avatar}
                    alt={`${item.name}'s avatar`}
                    style={{ borderRadius: 16 }}
                  />
                  <td>
                    {item.editable ? (
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => {
                          setNewName(e.target.value);
                        }}
                      />
                    ) : (
                      item.name
                    )}
                  </td>
                </td>
                <td>{item.dateOfBirth}</td>
                <td>{item.city}</td>
                <td>{item.country}</td>
                <td className="flex">
                  {item.editable ? (
                    <Image
                      src={"/diskette.png"}
                      width={24}
                      height={24}
                      alt={"delete icon"}
                    />
                  ) : (
                    <div
                      onClick={() =>
                        setEditMode({
                          id: item.id,
                          editable: true,
                          newName: item.name,
                        })
                      }
                    >
                      <Image
                        src={"/pen.png"}
                        width={24}
                        height={24}
                        alt={"edit icon"}
                      />
                    </div>
                  )}
                  <div className="delete" onClick={() => onDelete(item.id)}>
                    <Image
                      src={"/delete.png"}
                      width={24}
                      height={24}
                      alt={"delete icon"}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}
