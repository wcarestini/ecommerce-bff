import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as parser from 'xml2js';

enum DeliveryType {
  SEDEX = 'SEDEX',
  PAC = 'PAC',
}

@Injectable()
export class DeliveriesService {
  async getDeliveryOptions(cep: string) {
    let response = null;

    try {
      response = await axios.get(
        `http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?sCepOrigem=${process.env.ORIGIN_CEP}&sCepDestino=${cep}&nVlPeso=1&nCdFormato=1&nVlComprimento=20&nVlAltura=20&nVlLargura=20&nVlDiametro=0&nCdServico=04014&nCdEmpresa=&sDsSenha=&sCdMaoPropria=n&nVlValorDeclarado=0&sCdAvisoRecebimento=n&StrRetorno=xml&nIndicaCalculo=3`,
      );
    } catch (e) {
      throw new HttpException(
        'Não foi possível encontrar opções de entrega.',
        HttpStatus.BAD_REQUEST,
      );
    }

    let responseJson = await new Promise((resolve, reject) =>
      parser.parseString(response.data, (err, jsonData) => {
        if (err) {
          reject(err);
        }
        resolve(jsonData);
      }),
    );

    let deliveryOptions = responseJson['Servicos']['cServico'].map(
      (correiosOption) => {
        return {
          code: String(correiosOption['Codigo']),
          price: String(correiosOption['Valor']),
          deadline: String(correiosOption['PrazoEntrega']) + ' dia(s)',
          type: this.getType(correiosOption['Codigo'][0]),
        };
      },
    );

    return deliveryOptions;
  }

  private getType(code: any) {
    if (code == '04014') {
      return DeliveryType.SEDEX;
    } else if (code == '04510') {
      return DeliveryType.PAC;
    }
  }
}
