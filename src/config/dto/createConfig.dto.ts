import { IsArray, IsNotEmpty, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ComponentConfig {
  @IsNotEmpty()
  component_name: string;

  @IsNotEmpty()
  page_number: number;
}

export class CreateConfigDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ComponentConfig)
  components: ComponentConfig[];
}
