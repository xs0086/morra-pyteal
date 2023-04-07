from pyteal import *
import program

def approval():
    #varijable
    local_opponent=Bytes("opponent")
    local_hash_hand=Bytes("hashedhand")
    local_real_hand=Bytes("realhand")
    local_wager=Bytes("wager")
    local_hash_sum=Bytes("hashedsum")
    local_real_sum=Bytes("realsum")

    #operacije
    op_start=Bytes("start")
    op_accept=Bytes("accept")
    op_resolve=Bytes("resolve")



    @Subroutine(TealType.none)
    def get_ready(account: Expr):
        return Seq(
            App.localPut(account,local_opponent,Bytes("")),
            App.localPut(account,local_hash_hand,Bytes("")),
            App.localPut(account,local_real_hand,Int(0)),
            App.localPut(account,local_wager,Int(0)),
            App.localPut(account,local_hash_sum,Bytes("")),
            App.localPut(account,local_real_sum,Int(0))

        )
    
    @Subroutine(TealType.uint64)
    def check_if_empty(account:Expr):
        return Return(
            And(
                App.localGet(account,local_opponent)==Bytes(""),
                App.localGet(account,local_hash_hand)==Bytes(""),
                App.localGet(account,local_real_hand)==Int(0),
                App.localGet(account,local_wager)==Int(0),
                App.localGet(account,local_hash_sum)==Bytes(""),
                App.localGet(account,local_real_sum)==Int(0),
            )
        )
    
    perform_checks=Assert(
        And(
            Global.group_size()==Int(2),
            Txn.group_index()==Int(0),
            Gtxn[1].type_enum()==TxnType.Payment,
            Gtxn[1].receiver()==Global.current_application_address(),
            Gtxn[0].rekey_to()==Global.zero_address(),
            Gtxn[1].rekey_to()==Global.zero_address(),
            App.optedIn(Txn.accounts[1],Global.current_application_id())



        )
    )
    
    @Subroutine(TealType.none)
    def start_game():
        return Seq(
            perform_checks,
            Assert(
                And(
                     #App.localGet(Txn.accounts[0],local_hash_sum)>=2,
                     # App.localGet(Txn.accounts[0],local_hash_sum)<=10,
                    check_if_empty(Txn.sender()),
                    check_if_empty(Txn.accounts[1]),
            
                )
            ),
            App.localPut(Txn.sender(),local_opponent,Txn.accounts[1]),
            App.localPut(Txn.sender(),local_hash_hand,Txn.application_args[1]),
            App.localPut(Txn.sender(),local_wager,Gtxn[1].amount()),
            App.localPut(Txn.sender(),local_hash_sum,Txn.application_args[2]),
            Approve()
   
        )
    
    @Subroutine(TealType.none)
    def accept_game():
        return Seq(
            perform_checks,
            #Assert(
                #And(
                    #App.localGet(Txn.accounts[1],local_real_sum)>=Int(2),
                    # App.localGet(Txn.accounts[1],local_real_sum)<=10,
                    
                    # check_if_empty(Txn.sender()),
                    
            
               # )
            #),
            App.localPut(Txn.sender(),local_opponent,Txn.accounts[1]),
            App.localPut(Txn.sender(),local_real_hand,Btoi(Txn.application_args[1])),
            App.localPut(Txn.sender(),local_wager,Gtxn[1].amount()),
            App.localPut(Txn.sender(),local_real_sum,Btoi(Txn.application_args[2])),
            Approve()
   
        )
    
    @Subroutine(TealType.none)
    def transfer_wager(acc_index:Expr, wager:Expr):
        return Seq(
            InnerTxnBuilder.Begin(),

            InnerTxnBuilder.SetFields({
                TxnField.type_enum:TxnType.Payment,
                TxnField.receiver:Txn.accounts[acc_index],
                TxnField.amount:wager
            }),
            InnerTxnBuilder.Submit()
        )


    @Subroutine(TealType.none)
    def calc_winner(hand_a: Expr,hand_b: Expr, sum_a: Expr,sum_b: Expr, wager: Expr):

        return Seq(
            If(
                sum_a==sum_b
            )
            .Then(
                Seq(
                    transfer_wager(Int(0),wager),
                    transfer_wager(Int(1),wager)
                )
            )
            .ElseIf(
                #ako nisu recene iste sume i pogresne su obe
                And(
                    (hand_a + hand_b)!=sum_a,
                    (hand_a + hand_b)!=sum_b
                )
            )
            .Then(
                Seq(
                    transfer_wager(Int(0),wager),
                    transfer_wager(Int(1),wager)
                )
            )
            .ElseIf(
                #ako drugi igrac uvek pobedi
                (hand_a + hand_b) == sum_b
            )
            .Then(
                transfer_wager(Int(1), wager*Int(2))
            )
            .Else(
                #ako pobedi prvi igrac
                transfer_wager(Int(0), wager*Int(2))
            )

        )




    @Subroutine(TealType.none)
    def resolve_game():
        hand_a= ScratchVar(TealType.uint64)
        hand_b= ScratchVar(TealType.uint64)
        sum_a= ScratchVar(TealType.uint64)
        sum_b= ScratchVar(TealType.uint64)
        wager= ScratchVar(TealType.uint64)

        return Seq(
            Assert(
                And(
                    Global.group_size()==Int(1),
                    Txn.group_index()==Int(0),
                    
                    Gtxn[0].rekey_to()==Global.zero_address(),

                    #provera da li su ulozi isti
                    App.localGet(Txn.accounts[1], local_wager) == App.localGet(Txn.accounts[0], local_wager),

                    #provera da li je prvi igrac iskren za ruku
                    App.localGet(Txn.sender(), local_hash_hand) == Sha256(Txn.application_args[1]),

                    #provera da li je prvi igrac iskren za sumu 
                    App.localGet(Txn.sender(), local_hash_sum) == Sha256(Txn.application_args[2]),

                    Txn.application_args.length()==Int(3)

                    
                )
            ),
            hand_a.store(App.localGet(Txn.accounts[0],local_real_hand)),
            hand_b.store(App.localGet(Txn.accounts[1],local_real_hand)),
            sum_a.store(App.localGet(Txn.accounts[0],local_real_sum)),
            sum_b.store(App.localGet(Txn.accounts[1],local_real_sum)),
            wager.store(App.localGet(Txn.accounts[0],local_wager)),

            calc_winner(hand_a.load(),hand_b.load(),sum_a.load(),sum_b.load(),wager.load()),

            Approve()

        )

    return program.event(
        init=Approve(),
        opt_in=Seq(
        get_ready(Txn.sender()),
        Approve()
        ),
        no_op=Seq(
            Cond(
                [Txn.application_args[0]==op_start,start_game()],
                [Txn.application_args[0]==op_accept,accept_game()],
                [Txn.application_args[0]==op_resolve,resolve_game()]
            ),
            Reject()
        )
    )



def clear():
    return Approve()