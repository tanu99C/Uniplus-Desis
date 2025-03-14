import React, { useState, useEffect } from "react";
import { db, auth, storage } from "../lib/firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./LostFound.css";

const LostAndFound = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: "",
    description: "",
    type: "lost",
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(db, "lostAndFound"));
    const itemsArray = await Promise.all(
      querySnapshot.docs.map(async (itemDoc) => {
        const itemData = itemDoc.data();
        let userName = "Unknown User";
        
        if (itemData.userId) {
          const userDocRef = doc(db, "loginPage", "userDetails");
          const userSnapshot = await getDoc(userDocRef);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data()[`user_${itemData.userId}`];
            if (userData) {
              userName = userData.name;
            }
          }
        }

        return { id: itemDoc.id, ...itemData, userName };
      })
    );
    setItems(itemsArray);
  };

  const handleAddItem = async () => {
    if (!auth.currentUser) {
      alert("You must be logged in to add items.");
      return;
    }

    if (!formData.title || !formData.location || !formData.date || !formData.description || !formData.image) {
      alert("All fields are required!");
      return;
    }

    setIsSubmitting(true);

    let imageUrl = "";
    if (formData.image) {
      const imageRef = ref(storage, `images/${Date.now()}`);
      const response = await fetch(formData.image);
      const blob = await response.blob();
      await uploadBytes(imageRef, blob);
      imageUrl = await getDownloadURL(imageRef);
    }

    await addDoc(collection(db, "lostAndFound"), {
      ...formData,
      imageUrl,
      userId: auth.currentUser.uid,
    });

    setIsSubmitting(false);
    setModalVisible(false);
    alert("Item added successfully!");
    window.location.reload();
  };

  const handleDeleteItem = async (itemId, userId) => {
    if (auth.currentUser?.uid !== userId) {
      alert("You can only delete your own items!");
      return;
    }

    await deleteDoc(doc(db, "lostAndFound", itemId));
    alert("Item deleted successfully!");
    fetchItems();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, image: URL.createObjectURL(file) });
    }
  };

  const renderItem = (item) => {
    if (activeTab !== "all" && item.type !== activeTab) return null;
    return (
      <div key={item.id} className="item-card">
        <img src={item.imageUrl} alt={item.title} />
        <p><strong>{item.type.toUpperCase()}:</strong> {item.title}</p>
        <p><strong>Location:</strong> {item.location}</p>
        <p><strong>Date:</strong> {item.date}</p>
        <p><strong>Description:</strong> {item.description}</p>
        <p><strong>Uploaded by:</strong> {item.userName}</p>
        {auth.currentUser?.uid === item.userId && (
          <button onClick={() => handleDeleteItem(item.id, item.userId)} style={{ color: "red" }}>Delete</button>
        )}
      </div>
    );
  };

  return (
    <div className="lost-found-container">
      <div className="tabs">
        {["all", "lost", "found"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
          >
            {tab === "all" ? "All Items" : tab === "lost" ? "Lost Items" : "Found Items"}
          </button>
        ))}
      </div>

      <button 
        onClick={() => {
          if (!auth.currentUser) {
            alert("Please log in to add an item");
          } else {
            setModalVisible(true);
          }
        }} 
        className="submit-button"
      >
        + Report Lost/Found Item
      </button>

      <div className="items-container">
        {items.map((item) => renderItem(item))}
      </div>

      {modalVisible && (
        <div className="modal-overlay" onClick={() => setModalVisible(false)}></div>
      )}

      {modalVisible && (
        <div className="modal-form">
          <h3>Add Lost/Found Item</h3>
          <input type="text" placeholder="Title" onChange={(e) => setFormData({ ...formData, title: e.target.value })} value={formData.title} disabled={isSubmitting} />
          <input type="text" placeholder="Location" onChange={(e) => setFormData({ ...formData, location: e.target.value })} value={formData.location} disabled={isSubmitting} />
          <input type="text" placeholder="Date (YYYY-MM-DD)" onChange={(e) => setFormData({ ...formData, date: e.target.value })} value={formData.date} disabled={isSubmitting} />
          <textarea placeholder="Description" onChange={(e) => setFormData({ ...formData, description: e.target.value })} value={formData.description} disabled={isSubmitting} />
          <input type="file" onChange={handleImageChange} disabled={isSubmitting} />
          <button onClick={handleAddItem} disabled={isSubmitting} className="submit-button">{isSubmitting ? "Submitting..." : "Submit"}</button>
        </div>
      )}
    </div>
  );
};

export default LostAndFound;


// ...............................................................................................
// MAIN CODE final
// import React, { useState, useEffect } from "react";
// import { db, auth, storage } from "../lib/firebaseConfig";
// import { collection, addDoc, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// // import "./LostFound.css";

// const LostAndFound = () => {
//   const [activeTab, setActiveTab] = useState("all");
//   const [items, setItems] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     location: "",
//     date: "",
//     description: "",
//     type: "lost",
//     image: null,
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     fetchItems();
//   }, []);

//   const fetchItems = async () => {
//     const querySnapshot = await getDocs(collection(db, "lostAndFound"));
//     const itemsArray = await Promise.all(
//       querySnapshot.docs.map(async (itemDoc) => {
//         const itemData = itemDoc.data();
//         const userDocRef = doc(db, "loginPage", "userDetails");
//         const userSnapshot = await getDoc(userDocRef);
//         const userData = userSnapshot.exists() ? userSnapshot.data()[`user_${itemData.userId}`] : null;
//         const userName = userData ? userData.name : "Unknown User";

//         return { id: itemDoc.id, ...itemData, userName };
//       })
//     );
//     setItems(itemsArray);
//   };

//   const handleAddItem = async () => {
//     if (!auth.currentUser) {
//       alert("You must be logged in to add items.");
//       return;
//     }

//     if (!formData.title || !formData.location || !formData.date || !formData.description || !formData.image) {
//       alert("All fields are required!");
//       return;
//     }

//     setIsSubmitting(true);

//     let imageUrl = "";
//     if (formData.image) {
//       const imageRef = ref(storage, `images/${Date.now()}`);
//       const response = await fetch(formData.image);
//       const blob = await response.blob();
//       await uploadBytes(imageRef, blob);
//       imageUrl = await getDownloadURL(imageRef);
//     }

//     await addDoc(collection(db, "lostAndFound"), {
//       ...formData,
//       imageUrl,
//       userId: auth.currentUser.uid,
//     });

//     setIsSubmitting(false);
//     setModalVisible(false);
//     alert("Item added successfully!");
//     window.location.reload();
//   };

//   const handleDeleteItem = async (itemId, userId) => {
//     if (auth.currentUser.uid !== userId) {
//       alert("You can only delete your own items!");
//       return;
//     }

//     await deleteDoc(doc(db, "lostAndFound", itemId));
//     alert("Item deleted successfully!");
//     fetchItems();
//   };

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setFormData({ ...formData, image: URL.createObjectURL(file) });
//     }
//   };

//   const renderItem = (item) => {
//     if (activeTab !== "all" && item.type !== activeTab) return null;
//     return (
//       <div key={item.id} style={{ padding: "10px", margin: "10px", backgroundColor: "white", borderRadius: "8px" }}>
//         <img src={item.imageUrl} alt={item.title} style={{ width: "100px", height: "100px" }} />
//         <p><strong>{item.type.toUpperCase()}:</strong> {item.title}</p>
//         <p><strong>Location:</strong> {item.location}</p>
//         <p><strong>Date:</strong> {item.date}</p>
//         <p><strong>Description:</strong> {item.description}</p>
//         <p><strong>Uploaded by:</strong> {item.userName}</p>
//         {auth.currentUser?.uid === item.userId && (
//           <button onClick={() => handleDeleteItem(item.id, item.userId)} style={{ color: "red" }}>Delete</button>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div style={{ padding: "20px", marginTop: "60px" }}>
//       <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
//         {["all", "lost", "found"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             style={{
//               backgroundColor: activeTab === tab ? "blue" : "gray",
//               padding: "10px",
//               borderRadius: "5px",
//               color: "white",
//               margin: "0 10px",
//             }}
//           >
//             {tab === "all" ? "All Items" : tab === "lost" ? "Lost Items" : "Found Items"}
//           </button>
//         ))}
//       </div>

//       <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
//         <button
//           onClick={() => auth.currentUser ? setModalVisible(true) : alert("Please log in to add an item")}
//           style={{ backgroundColor: "blue", padding: "10px 20px", borderRadius: "5px", color: "white" }}
//         >
//           + Report Lost/Found Item
//         </button>
//       </div>

//       <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "20px" }}>
//         {items.map((item) => renderItem(item))}
//       </div>

//       {modalVisible && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: "rgba(0, 0, 0, 0.5)",
//             zIndex: 998,
//           }}
//           onClick={() => setModalVisible(false)}
//         ></div>
//       )}

//       {modalVisible && (
//         <div
//           style={{
//             position: "fixed",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             backgroundColor: "white",
//             padding: "20px",
//             borderRadius: "10px",
//             zIndex: "999",
//             boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
//           }}
//         >
//           <h3>Add Lost/Found Item</h3>
//           <input type="text" placeholder="Title" onChange={(e) => setFormData({ ...formData, title: e.target.value })} value={formData.title} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} disabled={isSubmitting} />
//           <input type="text" placeholder="Location" onChange={(e) => setFormData({ ...formData, location: e.target.value })} value={formData.location} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} disabled={isSubmitting} />
//           <input type="text" placeholder="Date (YYYY-MM-DD)" onChange={(e) => setFormData({ ...formData, date: e.target.value })} value={formData.date} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} disabled={isSubmitting} />
//           <textarea placeholder="Description" onChange={(e) => setFormData({ ...formData, description: e.target.value })} value={formData.description} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} disabled={isSubmitting} />
//           <input type="file" onChange={handleImageChange} style={{ marginBottom: "10px" }} disabled={isSubmitting} />
          
//           <label>Item Type:</label>
//           <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
//             <label>
//               <input type="radio" value="lost" checked={formData.type === "lost"} onChange={(e) => setFormData({ ...formData, type: e.target.value })} disabled={isSubmitting} />
//               Lost
//             </label>
//             <label>
//               <input type="radio" value="found" checked={formData.type === "found"} onChange={(e) => setFormData({ ...formData, type: e.target.value })} disabled={isSubmitting} />
//               Found
//             </label>
//           </div>

//           <button onClick={handleAddItem} disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit"}</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LostAndFound;