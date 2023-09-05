import { Component, OnInit,Inject } from '@angular/core';
import { FormGroup,FormBuilder, Validators} from '@angular/forms';
import { ApiService } from '../services/api.service';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-add-item-form',
  templateUrl: './add-item-form.component.html',
  styleUrls: ['./add-item-form.component.css']
})
export class AddItemFormComponent implements OnInit {
productForm!:FormGroup;
actionBtn:string = "Add Item";
constructor(private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public editData:any ,
  private api: ApiService, private dialogRef: MatDialogRef<AddItemFormComponent>){

}
ngOnInit():void{
this.productForm = this.formBuilder.group({//Form group for send data to db
  productName : ['',Validators.required],
  price : ['',Validators.required]
});
console.log(this.editData);

if(this.editData){ //to update data on edit Item
  this.actionBtn = "Update";
  this.productForm.controls['productName'].setValue(this.editData.productName);
  this.productForm.controls['price'].setValue(this.editData.price);
}
}

//Function for adding new item in the cart
addProduct(){
if(!this.editData){
  if(this.productForm.valid){
    this.api.postItem(this.productForm.value).subscribe({
      next:(resp)=>{//observer//if succeed it will run next block
        alert('Item addes successfully!');
        this.productForm.reset();
        this.dialogRef.close('save');
      },
      error:()=>{//if error it will run error block
        alert('somthing went wrong...')
      }
    })
   }
}else{
  this.updateItem();
}
}
updateItem(){
  this.api.putItem(this.productForm.value,this.editData.id).subscribe({
    next:(res)=>{
      alert('updated successfully!');
      this.productForm.reset();
      this.dialogRef.close('update');
    },
    error:()=>{
      alert('error while updating...')
    }
  })
}
}
