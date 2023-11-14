import { Component, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Producto } from './Producto';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@Injectable({
    providedIn: 'root'
})

  export class AppComponent {


  API_URL = "https://localhost:7057/api/";

  title = 'CANDO-JAIME-LECCION1';

  form: FormGroup;

  tipoProducto : String[] = [
    'Lacteos',  
    'Carnes',
    'Frutas',
    'Verduras',
    'Granos',
    'Bebidas',
    'Aseo',
    'Confiteria',
    'Panaderia',
    'Electrodomesticos'
  ];
  
  dataSource = new MatTableDataSource<Producto>();

  displayedColumns: string[] = ['codigo', 'nombre', 'tipo', 'precio', 'cantidad', 'subtotal', 'eliminar'];

  productos : Producto[] = [];

  totalCantidad: number = 0;

  totalPrecio: number = 0;

  ngOnInit(): void {
    this.obtenerProductos();
  }

  agregarProducto(){
    const producto: Producto = {
      codigo: this.form.get('codigo')!.value,
      nombre: this.form.get('nombre')!.value,
      tipo: this.form.get('tipo')!.value,
      precio: this.form.get('precio')!.value,
      cantidad: this.form.get('cantidad')!.value,
    };
    console.log(producto);
    //aqui colocar funcion para guardar el producto en la base de datos
    this.http.post(this.API_URL + 'producto', producto).subscribe((res: any) => {
      console.log(res);
    });
    this.obtenerProductos();
    this.form.reset();
  }


  obtenerProductos(): void{
    //aqui colocar funcion para obtener los productos de la base de datos
    this.productos = [];
    this.http.get(this.API_URL + 'producto').subscribe((res: any) => {
      console.log(res);
      this.productos = res;
      this.dataSource.data = this.productos;
    });
    this.totalCantidad = this.productos.length;
    this.totalPrecio = this.sumarPrecios();
  }

  sumarPrecios(): number{
    let total = 0;
    for (let i = 0; i < this.productos.length; i++) {
      total += this.productos[i].precio;
    }
    return total;
  }

  eliminarProducto(codigo: String): void{
    //aqui colocar funcion para eliminar el producto de la base de datos
    this.http.delete(this.API_URL + 'producto/' + codigo).subscribe((res: any) => {
      console.log(res);
      console.log("Producto eliminado");
    });
    this.obtenerProductos();
  }


  cancelar(){
    this.form.reset();
  }


  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      codigo: ['',[Validators.required]],
      nombre: ['', Validators.required],
      tipo: ['', Validators.required],
      precio: ['', 
        Validators.required,
        Validators.pattern(/^[0-9]+(\.?[0-9]+)?$/)
      ]
      ,
      cantidad: ['', 
        Validators.required,
        Validators.pattern(/^[0-9]+(\.?[0-9]+)?$/)
      ]
    });
  }
}
