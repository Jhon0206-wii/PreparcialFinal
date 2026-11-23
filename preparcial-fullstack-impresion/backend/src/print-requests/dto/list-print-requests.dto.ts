import type { PrintStatus } from "../print-request.entity";
import {IsIn, IsOptional} from "class-validator";

export class ListPrintRequestsDto {
  // TODO: validar el parámetro opcional status de acuerdo con el enunciado.
 @IsOptional()
  @IsIn(['pending', 'printed' ])
  status?: PrintStatus ;
}
