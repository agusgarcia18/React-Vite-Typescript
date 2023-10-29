import { useEffect, useState } from "react";
import { Product } from "../../types/Product";
import { ProductService } from "../../services/ProductService";
import Loader from "../Loader/Loader";
import { Button, Table } from "react-bootstrap";
import { ModalType } from "../../types/ModalTypes";
import ProductModal from "../ProductModal/ProducModal.tsx";
import { EditButton} from "../EditButton/EditButton.tsx";
import { DeleteButton } from "../DeleteButton/DeleteButton.tsx";

const ProductTable = () => {

    //Variable que va a contener los datos recibidos por la API
    const [products, setProducts] = useState<Product[]>([]);

//Variable que muestra el componente Loader hasta que se reciban los datos de la API
    const [isLoading, setIsLoading] = useState(true);

//Variable que va a actualizar los datos de al tabla luego de cada operacion existosa
const [refreshData, setRefreshData] = useState(false);    

//Este hook se va a ejecutar cada vez que se renderize el componente
//refreshData cambie de estado
    useEffect(() => {

        //Llamamos a la funcion para obtener todos los productos declarado en el service
        const fetchProducts = async () => {
            const products = await ProductService.getProducts();
            setProducts(products);
            setIsLoading(false);
        };

        fetchProducts();

    }, [refreshData]);

    //Se inicializa un producto vacio cuando vallamos a crear uno nuevo, para evitar "undefined"
const initializeNewProduct = (): Product => {
    return {
        id: 0,
        tittle: "",
        price: 0,
        description: "",
        category: "",
        image: "",
    };
};

        //Producto seleccionado que se va a pasar como prop al Modal
        const [product, setProduct] = useState<Product>(initializeNewProduct);

        //Manejo de Modal
        const [showModal, setShowModal] = useState(false);
        const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
        const [title, setTitle] = useState("");

        //Logica de Modal
        const handleClick = (newTitle: string, prod: Product, modal: ModalType) => {
            setTitle(newTitle);
            setModalType(modal)
            setProduct(prod);
            setShowModal(true);
        };

//Test, este log esta modificado para que muestre los datos de una manera mas legible
    console.log(JSON.stringify(products, null, 2));
    
    return(
        
        <>
        <Button onClick={() => handleClick("Nuevo Producto", initializeNewProduct(), ModalType.CREATE)}>
                Nuevo Producto
        </Button>
        {isLoading ? <Loader /> : (
            <Table hover>
                <thead>
                    <tr>
                        <th>Titulo</th>
                        <th>Precio</th>
                        <th>Descripcion</th>
                        <th>Categoria</th>
                        <th>Imagen</th>
                        <th>Editar</th>
                        <th>Borrar</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.tittle}</td>
                            <td>{product.price}</td>
                            <td>{product.description}</td>
                            <td>{product.category}</td>
                            <td><img src={product.image} alt={product.tittle} style={{width: '50px'}} /></td>
                            <td><EditButton onClick={() => handleClick("Editar Producto", product, ModalType.UPDATE)}/></td>
                            <td><DeleteButton onClick={() => handleClick("Borrar Producto", product, ModalType.DELETE)}/></td>

                        </tr>
                    ))}
                </tbody>
            </Table>
        )}

        {showModal && (
            <ProductModal                 
            show={showModal}
            onHide={() => setShowModal(false)}
            title={title}
            modalType={modalType}
            prod={product}
            refreshData={setRefreshData}
            />
        )}

        </>
    )
}

export default ProductTable;
