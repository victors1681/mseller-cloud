<?php

namespace WPGraphQL\CardNet;

use WPGraphQL\CardNet\CardNetApi;

class CardNetPurchase
{

    public function init()
    {
        //add_action('graphql_register_types', [$this, 'register_cardnet_purchase_fields'], 10);

        add_action('graphql_register_types', ['\WPGraphQL\CardNet\CardNetPurchase', 'register_cardnet_purchase_fields'], 10);
    }

    public static function mapStep($steps)
    {
        $s = array();
        foreach ($steps as $step) {

            array_push($s, [
                "step" => $step["Step"],
                "created" => $step["Created"],
                "status" => $step["Status"],
                "responseCode" => $step["ResponseCode"],
                "responseMessage" => $step["ResponseMessage"],
                "error" => $step["Error"],
                "authorizationCode" => $step["AuthorizationCode"],
                "uniqueID" => $step["UniqueID"],
                "acquirerResponseDetail" => $step["AcquirerResponseDetail"]
            ]);
        }

        return $s;
    }

    public static function mapRefund($refunds)
    {
        $r = array();
        foreach ($refunds as $refund) {

            array_push($r, [
                "purchaseRefundId" => $refund["PurchaseRefundId"],
                "created" => $refund["Created"],
                "uniqueID" => $refund["UniqueID"],
                "amount" => $refund["Amount"],
                "currency" => $refund["Currency"],
                "status" => $refund["Status"]
            ]);
        }

        return $r;
    }


    public static function mapTransaction($transaction)
    {

        return [
            'transactionID' => $transaction['TransactionID'],
            'created' => $transaction['Created'],
            'transactionStatusId' => $transaction['TransactionStatusId'],
            'status' => $transaction['Status'],
            'description' => $transaction['Description'],
            'approvalCode' => $transaction['ApprovalCode'],
            'steps' => self::mapStep($transaction['Steps'])
        ];
    }

    public static function mapDataDO($dataDo)
    {
        return [
            'invoice' => $dataDo['Invoice'],
            'tax' => $dataDo['Tax']
        ];
    }

    public static function mapPurchase($result)
    {
        return [
            'purchaseId' => $result['PurchaseId'],
            'created' => $result['Created'],
            'trxToken' => $result['TrxToken'],
            'order' => $result['Order'],
            'transaction' => self::mapTransaction($result['Transaction']),
            'capture' => $result['Capture'],
            'amount' => $result['Amount'],
            'originalAmount' => $result['OriginalAmount'],
            'tip' => $result['Tip'],
            'installments' => $result['Installments'],
            'currency' => $result['Currency'],
            'description' => $result['Description'],
            'customer' => CardNetCustomer::mapCustomerObject($result['Customer']),
            'refundList' => self::mapRefund($result['RefundList']),
            'uniqueID' => $result['UniqueID'],
            'planID' => $result['PlanID'],
            'additionalData' => $result['AdditionalData'],
            'customerUserAgent' => $result['CustomerUserAgent'],
            'customerIP' => $result['CustomerIP'],
            'url' => $result['URL'],
            'dataDO' => self::mapDataDO($result['DataDO']),
        ];
    }


    public static function mapPurchaseList($purchases)
    {
        $s = array();
        foreach ($purchases as $purchase) {
            array_push($s, self::mapPurchase($purchase));
        }

        return $s;
    }

    public static function register_cardnet_purchase_fields()
    {

        $transactionSteps = [
            'Step' => [
                'type' => 'String',
                'description' => __('Nombre del paso ejecutado.', 'cardnet'),
            ],
            'Created' => [
                'type' => 'String',
                'description' => __('Fecha y hora del momento de ejecuci??n del paso.', 'cardnet'),
            ],
            'Status' => [
                'type' => 'String',
                'description' => __('Estado final luego de la ejecuci??n del paso.', 'cardnet'),
            ],
            'ResponseCode' => [
                'type' => 'String',
                'description' => __('C??digo de respuesta obtenido luego de la ejecuci??n del paso actual. Contiene por ejemplo el c??digo de respuesta del medio de pago.', 'cardnet'),
            ],
            'ResponseMessage' => [
                'type' => 'String',
                'description' => __('Mensaje de respuesta asociado al ResponseCode.', 'cardnet'),
            ],
            'Error' => [
                'type' => 'String',
                'description' => __('C??digo de error generado (si corresponde) en la ejecuci??n del paso.', 'cardnet'),
            ],
            'AuthorizationCode' => [
                'type' => 'String',
                'description' => __('C??digo de aprobaci??n devuelto por el medio de pago.', 'cardnet'),
            ],
            'UniqueID' => [
                'type' => 'String',
                'description' => __('Identificador ??nico de la llamada (request) que desencaden?? la ejecuci??n de este paso. Utilizado para relacionar operaciones Refund y Rollback.', 'cardnet'),
            ],
            'AcquirerResponseDetail' => [
                'type' => 'String',
                'description' => __('', 'cardnet'),
            ]
        ];

        /**
         * Register transaction step Object
         */

        register_graphql_object_type('CardNetTransactionStep', [
            'description' => __('El objeto Transaction est?? asociado a un objeto Purchase y contiene la informaci??n de requerimiento enviado y la respuesta obtenida del medio de pago correspondiente. Adem??s, va asociado a los diferentes estados por los cuales puede pasar una transacci??n (autorizada, anulada, etc.)', 'cardnet'),
            'fields' => $transactionSteps
        ]);

        /**
         * PaymentProfile Object
         */

        $transactions = [
            'TransactionID' => [
                'type' => 'Int',
                'description' => __('Identificador de la Transacci??n', 'cardnet'),
            ],
            'Created' => [
                'type' => 'String',
                'description' => __('Fecha y hora del momento de creaci??n de la transacci??n.', 'cardnet'),
            ],
            'TransactionStatusId' => [
                'type' => 'Int',
                'description' => __('Identificador del Status de la transacci??n al momento de la consulta.', 'cardnet'),
            ],
            'Status' => [
                'type' => 'String',
                'description' => __('Estado de la transacci??n al momento de la consulta', 'cardnet'),
            ],
            'Description' => [
                'type' => 'String',
                'description' => __('Descripci??n del resultado de la transacci??n', 'cardnet'),
            ],
            'ApprovalCode' => [
                'type' => 'String',
                'description' => __('C??digo de aprobaci??n devuelto por el medio de pago', 'cardnet'),
            ],
            'Steps' => [
                'type' => ['list_of' => 'CardNetTransactionStep'],
                'description' => __('Lista de los estados intermedios desde que se cre?? la transacci??n.', 'cardnet'),
            ]
        ];

        /**
         * Register transaction Object
         */

        register_graphql_object_type('CardNetTransaction', [
            'description' => __('El objeto Transaction est?? asociado a un objeto Purchase y contiene la informaci??n de requerimiento enviado y la respuesta obtenida del medio de pago correspondiente. Adem??s, va asociado a los diferentes estados por los cuales puede pasar una transacci??n (autorizada, anulada, etc.)', 'cardnet'),
            'fields' => $transactions
        ]);


        /**
         * CountryDataDo Object
         */

        $countryDataDo = [
            'Invoice' => [
                'type' => 'String',
                'description' => __('Identificador de la Transacci??n', 'cardnet'),
            ],
            'Tax' => [
                'type' => 'Float',
                'description' => __('Fecha y hora del momento de creaci??n de la transacci??n.', 'cardnet'),
            ]
        ];

        /**
         * Register transaction Object
         */

        register_graphql_object_type('CardNetCountryDataDo', [
            'description' => __('Objeto utilizado para obtener datos de la Rep??blica Dominicana (C??digo ISO-3166 = DO).', 'cardnet'),
            'fields' => $countryDataDo
        ]);

        register_graphql_input_type('CardNetCountryDataDoInput', [
            'description' => __('Objeto utilizado para obtener datos de la Rep??blica Dominicana (C??digo ISO-3166 = DO).', 'cardnet'),
            'fields' => $countryDataDo
        ]);


        /**
         * Refund Object
         */

        $refund =  [
            'PurchaseRefundId' => [
                'type' => 'Int',
                'description' => __('Identificador de la Transacci??n', 'cardnet'),
            ],
            'Created' => [
                'type' => 'Float',
                'description' => __('Fecha y hora del momento de creaci??n de la transacci??n.', 'cardnet'),
            ],
            'UniqueID' => [
                'type' => 'String',
                'description' => __('', 'cardnet'),
            ],
            'Amount' => [
                'type' => 'Int',
                'description' => __('', 'cardnet'),
            ],
            'Currency' => [
                'type' => 'String',
                'description' => __('', 'cardnet'),
            ],
            'Status' => [
                'type' => 'String',
                'description' => __('', 'cardnet'),
            ]
        ];

        /**
         * Register Refund Object
         */

        register_graphql_object_type('CardNetRefund', [
            'description' => __('Objeto utilizado para obtener datos de la Rep??blica Dominicana (C??digo ISO-3166 = DO).', 'cardnet'),
            'fields' => $refund
        ]);



        /**
         * PaymentProfile Object
         */

        $purchaseFields = [
            'PurchaseId' => [
                'type' => 'Int',
                'description' => __('Identificador de la compra.', 'cardnet'),
            ],
            'Created' => [
                'type' => 'String',
                'description' => __('Fecha y hora del momento de la creaci??n de la compra. Este campo est?? presente en la respuesta a consultas. No se incluye o valida en la creaci??n o actualizaciones del objeto.', 'cardnet'),
            ],
            'TrxToken' => [
                'type' => 'String',
                'description' => __('Token que identifica la tarjeta del cliente', 'cardnet'),
            ],
            'Order' => [
                'type' => 'String',
                'description' => __('N??mero de orden, generado por el comercio', 'cardnet'),
            ],
            'Transaction' => [
                'type' => 'CardNetTransaction',
                'description' => __('Contiene la informaci??n que resulta de la transacci??n realizada contra el medio de pago (por ej: c??digo de respuesta, n??mero de autorizaci??n).', 'cardnet'),
            ],
            'Capture' => [
                'type' => 'Boolean',
                'description' => __('Establece si la compra se debe realizar en uno o dos pasos. Es de tipo booleano cuyo valor por defecto es ???true???. Si es false, solo se procesa la autorizaci??n y la compra queda pre-autorizada a la espera de la confirmaci??n final a trav??s de las llamadas commit (confirmar) y rollback (anular). Si es true, la transacci??n queda autorizada y capturada (confirmada).', 'cardnet'),
            ],
            'Amount' => [
                'type' => 'Int',
                'description' => __('Monto total de la compra. El valor debe ser mayor a cero.', 'cardnet'),
            ],
            'OriginalAmount' => [
                'type' => 'Int',
                'description' => __('Moneda de la compra, de acuerdo a ISO-4217 (c??digos alfanum??ricos).', 'cardnet'),
            ],
            'Tip' => [
                'type' => 'Int',
                'description' => __('Propina', 'cardnet'),
            ],
            'Installments' => [
                'type' => 'Int',
                'description' => __('Cantidad de cuotas de la compra', 'cardnet'),
            ],
            'Currency' => [
                'type' => 'String',
                'description' => __('Moneda de la compra, de acuerdo a ISO-4217 (c??digos alfanum??ricos).', 'cardnet'),
            ],
            'Description' => [
                'type' => 'String',
                'description' => __('Descripci??n opcional de la compra', 'cardnet'),
            ],
            'Customer' => [
                'type' => 'CardNetCustomer',
                'description' => __('Informaci??n del cliente que realiza el pago. Algunos medios de pago pueden requerir informaci??n adicional del cliente para poder tramitar la autorizaci??n.', 'cardnet'),
            ],
            'RefundList' => [
                'type' => 'CardNetRefund',
                'description' => __('Lista de devoluciones realizadas a la compra.', 'cardnet'),
            ],
            'PlanID' => [
                'type' => 'String',
                'description' => __('Reservado', 'cardnet'),
            ],
            'UniqueID' => [
                'type' => 'String',
                'description' => __('Identificador ??nico de la compra. Este valor opcional permite identificar una compra ??nica y evitar la duplicaci??n de transacciones en caso de errores de comunicaci??n (ver m??s en Conceptos / Identificador ??nico).', 'cardnet'),
            ],
            'AdditionalData' => [
                'type' => 'String',
                'description' => __('Informaci??n adicional que el comercio puede agregar a la transacci??n (Ej.: lista de datos de tipo ???Clave:Valor???).Dicha informaci??n ser?? devuelta al procesar la compra y cada vez que dicha compra sea consultada.', 'cardnet'),
            ],
            'CustomerUserAgent' => [
                'type' => 'String',
                'description' => __('User Agent del cliente que utiliza el servicio, en la Web deber??a ser el UserAgent reportado por el navegdor, en el caso de m??viles informaci??n acerca del dispositivo, S.O. utilizado, nombre de la App.', 'cardnet'),
            ],
            'CustomerIP' => [
                'type' => 'String',
                'description' => __('IP del cliente que utiliza el servicio.', 'cardnet'),
            ],
            'DataDo' => [
                'type' => 'CardNetCountryDataDo',
                'description' => __('Datos espec??ficos para la Rep. Dominicana. Ver
                la definici??n del objeto CountryDataDo. Detalle del objeto en la secci??n 6.9 CountryDataDo.', 'cardnet'),
            ],
            'CommerceAction' => [
                'type' => 'String',
                'description' => __('Utilizado para indicar al comercio una acci??n que deba ser realizada por ??l o por el customer para completar el proceso de la compra actual. Si la transacci??n se devolvi?? en estado Pending, se deber?? revisar este objeto para determinar las acciones siguientes.', 'cardnet'),
            ],
            'URL' => [
                'type' => 'String',
                'description' => __('URL donde se puede acceder a la informaci??n de la Compra. Ej: {ambiente_api}/v1/api/purchase/{purchase- id}).', 'cardnet'),
            ],
        ];

        register_graphql_object_type('CardNetPurchase', [
            'description' => __('CardNet Customer', 'Informaci??n del cliente que realiza el pago. Algunos medios de pago pueden requerir informaci??n adicional del cliente para poder tramitar la autorizaci??n.'),
            'fields' => $purchaseFields
        ]);



        $purchaseInput = [
            'TrxToken' => [
                'type' => ['non_null' => 'String'],
                'description' => __('Token que identifica la tarjeta del cliente'),
            ],
            'Order' => [
                'type' => ['non_null' => 'String'],
                'description' => __('N??mero de orden, generado por el comercio'),
            ],
            'Amount' => [
                'type' => ['non_null' => 'Int'],
                'description' => __('Monto total de la compra. El valor debe ser mayor a cero'),
            ],
            'Currency' => [
                'type' => ['non_null' => 'String'],
                'description' => __('Moneda de la compra, de acuerdo a ISO-4217 (c??digos alfanum??ricos).'),
            ],
            'Tip' => [
                'type' => 'Int',
                'description' => __('Cantidad de cuotas de la compra.'),
            ],
            'CustomerIP' => [
                'type' => 'String',
                'description' => __('IP del cliente que utiliza el servicio.'),
            ],
            'AdditionalData' => [
                'type' => 'String',
                'description' => __('Informaci??n adicional que el comercio puede agregar a la transacci??n (Ej.: lista de datos de tipo ???Clave:Valor???).Dicha informaci??n ser?? devuelta al procesar la compra y cada vez que dicha compra sea consultada.'),
            ],
            'UniqueID' => [
                'type' => 'String',
                'description' => __('Identificador ??nico de la compra. Este valor opcional permite identificar una compra ??nica y evitar la duplicaci??n de transacciones en caso de errores de comunicaci??n (ver m??s en Conceptos / Identificador ??nico).'),
            ],
            'Description' => [
                'type' => 'String',
                'description' => __('Descripci??n opcional de la compra'),
            ],
            'Capture' => [
                'type' => 'Boolean',
                'description' => __(''),
            ],
            'DataDo' => [
                'type' =>  ['non_null' => 'CardNetCountryDataDoInput'],
                'description' => __('Datos espec??ficos para la Rep. Dominicana. Ver la definici??n del objeto CountryDataDo. Detalle del objeto en la secci??n 6.9 CountryDataDo.'),
            ]
        ];


        register_graphql_mutation('purchaseCardnet', [
            'inputFields'  => $purchaseInput,
            'outputFields' => $purchaseFields,
            'mutateAndGetPayload' => function ($input, $context, $info) {

                CardNetUtils::isAuthenticated();

                $carnetApi = new CardNetApi();
                $result = $carnetApi->add_new_purchase($input);
                return self::mapPurchase($result);
            }
        ]);

        $refundInput = [
            'purchaseId' => [
                'type' => ['non_null' => 'Int'],
                'description' => __('Identificador de la compra'),
            ],
        ];

        register_graphql_mutation('refundCardnet', [
            'inputFields'  => $refundInput,
            'outputFields' => $purchaseFields,
            'mutateAndGetPayload' => function ($input, $context, $info) {

                CardNetUtils::isAuthenticated();

                $carnetApi = new CardNetApi();
                $result = $carnetApi->refund($input);
                return self::mapPurchase($result);
            }
        ]);


        /**
         * Resolver
         */

        register_graphql_field('RootQuery', 'purchaseCardnet', [
            'type' => 'CardNetPurchase',
            'description' => __('Obtener informaci??n de una compra', 'cardnet'),
            'args' => [
                'purchaseId' => [
                    'type' => array('non_null' => 'Int'),
                    'description' => __('Purchase ID number', 'cardnet'),
                ]
            ],
            'resolve' => function ($source, $args, $context, $info) {

                CardNetUtils::isAuthenticated();

                $purchaseId = $args['purchaseId'];

                $carnetApi = new CardNetApi();

                $result = $carnetApi->get_purchase($purchaseId);

                $mapped = self::mapPurchase($result);
                return $mapped;
            }
        ]);


        register_graphql_field('RootQuery', 'purchaseListCarnet', [
            'type' =>  ['list_of' => 'CardNetPurchase'],
            'description' => __('Obtener informaci??n de una compra', 'cardnet'),
            'resolve' => function ($source, $args, $context, $info) {

                CardNetUtils::isAdmin();

                $carnetApi = new CardNetApi();

                $result = $carnetApi->get_purchase_list();

                $mapped = self::mapPurchaseList($result);
                return $mapped;
            }
        ]);
    }
}