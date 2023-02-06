import { BeforeInsert, Column, Entity } from "typeorm";
import { SoftDeletableEntity } from "../interfaces";
import { generateEntityId } from "../utils";

@Entity()
export class Ingredient extends SoftDeletableEntity {
  @Column({type: 'varchar'})
  title: string | null;

  @BeforeInsert()
  private beforeInsert(): void {
    console.error('BEFOREINSERT'), this.id;

    if (this.id) return

    this.id = generateEntityId(this.id, "ingr")

    console.error('BEFOREINSERT2'), this.id;
  }
}