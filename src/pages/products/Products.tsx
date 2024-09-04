import React, { useState, useEffect } from "react";
import axios from "axios";

interface Product {
  id: string;
  title: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  images: string[];
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Product>({
    id: "",
    title: "",
    description: "",
    brand: "",
    category: "",
    price: 0,
    discountPercentage: 0,
    rating: 0,
    images: [],
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [language, setLanguage] = useState<string>("uz"); // Tilni boshqarish uchun o'zgaruvchi

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>("http://localhost:3000/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Mahsulotlarni olishda xato:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    try {
      const response = await axios.post("http://localhost:3000/products", {
        ...newProduct,
        id: String(new Date().getTime()),
        rating: 0,
      });
      setProducts([...products, response.data]);
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Mahsulot qo'shishda xato:", error);
    }
  };

  const handleEditProduct = async () => {
    if (editingProduct) {
      try {
        const response = await axios.put(
          `http://localhost:3000/products/${editingProduct.id}`,
          editingProduct
        );

        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === editingProduct.id ? response.data : product
          )
        );
        setIsModalOpen(false);
        setEditingProduct(null);
        resetForm();
      } catch (error) {
        console.error("Mahsulotni tahrirlashda xato:", error);
      }
    }
  };

  const resetForm = () => {
    setNewProduct({
      id: "",
      title: "",
      description: "",
      brand: "",
      category: "",
      price: 0,
      discountPercentage: 0,
      rating: 0,
      images: [],
    });
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tilga mos keladigan matnlar
  const texts = {
    uz: {
      title: "Mahsulotlar",
      searchPlaceholder: "Mahsulotlarni qidirish...",
      tableHeaders: ["Sarlavha", "Ta'rif", "Brend", "Kategoriyasi", "Narxi", "Foiz", "Tahrirlash", "O'chirish"],
      addButton: "Qo'shish",
      editProduct: "Mahsulotni tahrirlash",
      addProduct: "Mahsulot qo'shish",
      cancel: "Bekor qilish",
      update: "Yangilash",
    },
    en: {
      title: "Products",
      searchPlaceholder: "Search products...",
      tableHeaders: ["Title", "Description", "Brand", "Category", "Price", "Discount", "Edit", "Delete"],
      addButton: "Add",
      editProduct: "Edit Product",
      addProduct: "Add Product",
      cancel: "Cancel",
      update: "Update",
    },
  };

  const currentTexts = texts[language];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">{currentTexts.title}</h1>
      
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="border border-gray-300 p-2 rounded mb-4"
      >
        <option value="uz">O'zbekcha</option>
        <option value="en">English</option>
      </select>

      <input
        type="text"
        placeholder={currentTexts.searchPlaceholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-300 p-2 rounded mb-4 w-full"
      />


<table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            {currentTexts.tableHeaders.map((header, index) => (
              <th key={index} className="py-3 px-4 text-left font-semibold text-gray-700">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id} className="border-t border-gray-300">
              <td className="py-2 px-4">{product.title}</td>
              <td className="py-2 px-4">{product.description}</td>
              <td className="py-2 px-4">{product.brand}</td>
              <td className="py-2 px-4">{product.category}</td>
              <td className="py-2 px-4">{product.price}</td>
              <td className="py-2 px-4">{product.discountPercentage}%</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => {
                    setEditingProduct(product);
                    setIsModalOpen(true);
                    setNewProduct(product);
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                >
                  {currentTexts.tableHeaders[6]} {/* "Tahrirlash" yoki "Edit" */}
                </button>
              </td>
              <td className="py-2 px-4">
                <button
                  onClick={async () => {
                    try {
                      await axios.delete(`http://localhost:3000/products/${product.id}`);
                      setProducts((prevProducts) =>
                        prevProducts.filter((p) => p.id !== product.id)
                      );
                    } catch (error) {
                      console.error("Mahsulotni o'chirishda xato:", error);
                    }
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  {currentTexts.tableHeaders[7]} {/* "O'chirish" yoki "Delete" */}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => {
          setIsModalOpen(true);
          setEditingProduct(null);
          resetForm();
        }}
        className="bg-blue-500 text-white py-2 px-4 my-10 rounded"
      >
        {currentTexts.addButton} {/* "Qo'shish" yoki "Add" */}
      </button>


      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
            <h2 className="text-xl font-bold mb-4">{editingProduct ? currentTexts.editProduct : currentTexts.addProduct}</h2>
            <input
              type="text"
              placeholder="Sarlavha"
              value={newProduct.title}
              onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
              className="border border-gray-300 p-2 rounded mb-4 w-full"
            />
            <input
              type="text"
              placeholder="Ta'rif"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="border border-gray-300 p-2 rounded mb-4 w-full"
            />
            <input
              type="text"
              placeholder="Brend"
              value={newProduct.brand}
              onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
              className="border border-gray-300 p-2 rounded mb-4 w-full"
            />
            <input
              type="text"
              placeholder="Kategoriyasi"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              className="border border-gray-300 p-2 rounded mb-4 w-full"
            />
            <input
              type="number"
              placeholder="Narxi"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
              className="border border-gray-300 p-2 rounded mb-4 w-full"
            />
            <input
              type="number"
              placeholder="Foiz"
              value={newProduct.discountPercentage}
              onChange={(e) => setNewProduct({ ...newProduct, discountPercentage: Number(e.target.value) })}
              className="border border-gray-300 p-2 rounded mb-4 w-full"
            />

            <div className="flex justify-end">
              <button
                onClick={editingProduct ? handleEditProduct : handleAddProduct}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition mr-2"
              >
                {editingProduct ? currentTexts.update : currentTexts.addButton}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 transition"
              >
                {currentTexts.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
