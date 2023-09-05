import { AfterViewInit, Component, OnInit ,ViewChild} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AddItemFormComponent } from './add-item-form/add-item-form.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'shopingCart';

  displayedColumns: string[] = ['productName', 'price','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(public dialog: MatDialog, private api: ApiService) {}

  ngOnInit(): void {
   this.getCartList();
  }

 

  openDialog() {// it will open form to add item details
    this.dialog.open(AddItemFormComponent, {
     width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        console.log('save////////////');
        
        this.getCartList()
      }
    })
  }

  //Function for getting all cart list
  getCartList() {
    this.api.getItem().subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },  
      error:()=>{
        alert("Error Whilw fetching records")
      }
    })
  }

  editProduct(row:any){// to update cart value
   this.dialog.open(AddItemFormComponent,{
    width:'50%',
    data:row
   }).afterClosed().subscribe(val=>{
    if(val==='update'){
      this.getCartList();
    }
   })
  }

  deleteProduct(id:number){
    this.api.deleteItem(id).subscribe({
      next:(res)=>{
        alert('Item deleted..');
        this.getCartList();
      },
      error:()=>{
        alert('error while deleting//')
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
